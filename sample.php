<?php
class Customers extends CI_Model
{
    function __construct()
    {
        parent::__construct();

        $this->dash = $this->load->database("dash", true);

        $this->load->model("amt/objects/fault");

        if (empty($this->dash))
        {
            return new Fault('Unable to connect to database');
        }
    }

    // Customer assoc array might include the following properties:
    // enabled - defaults to 0
    // podioClientID - links to podio 'Client ID' field
    // name - corresponds to name used within podio as field
    // company - corresponds to company used within podio as field
    // accountID - customer optionally belongs to an account
    // note - optional note on the customer

    public function create($customer)
    {
        $customer =
        [
            $customer["id"],
            $customer["FirstName"] . " " . $customer["LastName"],
            $customer["Company"],
            (!isset($customer["enabled"])) ? '1' : $customer["enabled"]
        ];

        $this->load->helper("scrub");

        list($customer) = scrub_html($customer);

        $result = $this->dash->query("insert into customers (id, infusionsoft_id, name, company, enabled) values(NULL,?,?,?,?)", $customer);

        if ($result)
        {
            return $this->dash->insert_id();
        }
        else
        {
            return false;
        }
    }

    public function update($custID, $values)
    {
        $this->load->helper("scrub");

        list($target, $values) = scrub_html($target, $values);

        return $this->dash->update('customers', $values, ['id' => $custID]);
    }

    // Returns true in two cases:
    // If the key has at least one active client associated with it
    // or if no clients are associated with the key

    public function ownerIsEnabled($key)
    {
        $query = $this->dash->query("
                                    select c.enabled
                                    from customers as c
                                    join customer_licenses as cl
                                    on cl.customer_id=c.id
                                    where cl.license_key=?"
                                    , $key);

        if ($query->num_rows() == 0)
        {
            return true;
        }
        else
        {
            foreach ($query->result() as $customer)
            {
                if ($customer->enabled == '1')
                {
                    return true; // At least one active client exists
                }
            }

            // All clients associated with license are marked as 'inactive'

            return false;
        }
    }

    function exists($infusionsoftID)
    {
        $query = $this->dash->get_where('customers', array('infusionsoft_id' => $infusionsoftID));

        if ($query->num_rows() == 1)
        {
            return $query->row()->id;
        }
        else
        {
            return false;
        }
    }

    public function getLicenses($infusionsoftID)
    {
        $query = $this->dash->query("select * from customers, customer_licenses
                                    where customers.id=customer_licenses.customer_id
                                    and customers.infusionsoft_id=? ", $infusionsoftID);

        if (!empty($query))
        {
            return $query->result_array();
        }

        return new Fault("Database query failed. This error message could be more helpful...");
    }

    public function license($customerID, $details, $products)
    {
        $this->load->model("amt/licenses");

        // First we create a staging and production license...
        // The key that is generated is gauranteed not to exist in any of the three
        // datasets

        $key = $this->licenses->generateKey();


        // Massage the infusionsoft data into a 'license' style format

        $name = (isset($details["FirstName"])) ? $details["FirstName"] : "" ;
        $name .= ($details["LastName"]) ? " " . $details["LastName"] : "" ;


        $address = isset($details["Address2Street1"]) ? $details["Address2Street1"] : '';
        $address .=  (isset($details["Address2Street2"])) ? ' ' .$details["Address2Street2"] : '';

        // Normalize state character codes, should always be two digit abbreviations

        $state = '';

        if (isset($details["State2"]))
        {
            if (strlen($details["State2"]) > 2)
            {
                $state = $this->normalizeState($details["State2"]);
            }
            else
            {
                $state = $details["State2"];
            }
        }

        $zip = isset($details["PostalCode2"]) ? $details["PostalCode2"] : '';
        // Column in database licesning table only supports a 10 digit zip... // $zip .=  (isset($details["ZipFour2"])) ? '-' .$details["ZipFour2"] : '';

        $phone = $this->parsePhones($details);

        $ordered = $products;
        $products = $this->massageProducts($products);

        $markets = [];

        if (isset($details["_PrimaryMLS"]))
        {
            $this->load->model("amt/mls");

            // We are delivered an option number from infusionsoft, and must match this
            // to an mls market

            // TO DO...Support Multiple MLS Markets
            $marketID = $this->mls->mapFromInfusionSoft($details["_PrimaryMLS"]);

            if ($marketID != false)
            {
                $temp = new stdClass();

                $temp->value = $marketID;

                $markets[] = $temp;
            }
        }


        // Build a licensing object from the massaged data

        $values = new stdClass();

        $values->name =  $name;
        $values->office_name = (isset($details["Company"])) ? $details["Company"] : "";
        $values->email_address = (isset($details["Email"])) ? $details["Email"] : "";
        $values->enabled = "1";
        $values->mobile_phone = (isset($phone["mobile_phone"])) ? $phone["mobile_phone"] : "";
        $values->office_phone = (isset($phone["office_phone"])) ? $phone["office_phone"] : $phone["office_phone"] ;
        $values->fax = (isset($details["Fax1Type"]) && isset($details["Fax1"]) && $details["Fax1Type"] == "Work") ? $details["Fax1"] : '' ;
        $values->address = $address;
        $values->city = (isset($details["City2"])) ? $details["City2"] : '';
        $values->state_code = $state;
        $values->zip_code = $zip;
        $values->logo_url = '';
        $values->photo_url = '';
        $values->organization_id = '';


        $relatedData = new stdClass();

        $relatedData->products = $products;
        $relatedData->markets = $markets;
        $relatedData->sites = [];
        $relatedData->datasets =
        [
            "beta",
            "prod"
        ];

        if (isset($details["_StagingURL"]))
        {
            $temp = new stdClass();
            $temp->url_fragment = $details["_StagingURL"];
            $relatedData->sites[] = $temp;
        }

        // Finally do the deed

        $this->licenses->create($key, $values, $relatedData);

        // Insert the mls ids in both datasets if we have them

        if (!empty($markets))
        {
            if (isset($details["_AgentMLSID"]))
            {
                $temp = new stdClass();
                $temp->mls_id = $markets[0]->value;
                $temp->mls_agent_id = $details["_AgentMLSID"];
                $temp->enabled = 1;
                $this->mls->createAgent("beta", $key, $temp);
                $this->mls->createAgent("prod", $key, $temp);
            }
            if (isset($details["_IDXBrokerMLSID"]))
            {
                $temp = new stdClass();
                $temp->mls_id = $markets[0]->value;
                $temp->mls_office_id = $details["_IDXBrokerMLSID"];
                $temp->enabled = 1;
                $this->mls->createOffice("beta", $key, $temp);
                $this->mls->createOffice("prod", $key, $temp);
            }

            // The mls market should be disabled for the production version of the
            // license initially

            $temp = new stdClass();
            $temp->license_key = $key;
            $temp->id = $markets[0]->value;

            $this->mls->disableMarket("prod", $temp);

            // On the other hand, if spatialmatch is being configured turn on an mls market for it on the
            // staging license and some default capabiltities

            if (array_key_exists("spatialmatch", $ordered) && $ordered["spatialmatch"])
            {
                $this->load->model("capabilities");
                $this->capabilities->defaultSpatialMatchMLS("beta", $key, $markets[0]->value);
            }
        }

        // Add the production site to the license...

        if (isset($details["_PrimaryURL"]))
        {
            $this->load->model("amt/sites");

            $site = new stdClass();

            $site->url_fragment = $details["_PrimaryURL"];

            $this->sites->create("prod", $key, $site);
        }

        // And finally create an entry in customers_licenses

        $this->dash->query("insert into customer_licenses (customer_id, license_key, tag) values(?,?,NULL)", [$customerID, $key]);

        return $key;
    }

    private function parsePhones($customer)
    {
        $result =
        [
            "mobile_phone" => '',
            "office_phone" => ''
        ];

        $original =
        [
            [
                "type" => (isset($customer["Phone1Type"])) ? $customer["Phone1Type"] : "" ,
                "number" => (isset($customer["Phone1"])) ? $customer["Phone1"] : ''
            ],
            [
                "type" => (isset($customer["Phone2Type"])) ? $customer["Phone2Type"] : "" ,
                "number" => (isset($customer["Phone2"])) ? $customer["Phone2"] : ''
            ],
            [
                "type" => (isset($customer["Phone3Type"])) ? $customer["Phone3Type"] : "" ,
                "number" => (isset($customer["Phone3"])) ? $customer["Phone3"] : ''
            ],
        ];

        foreach ($original as $phone)
        {
            if ($phone["type"] == "Work" && $result["office_phone"] == '')
            {
                $result["office_phone"] = $phone["number"];
            }
            else if ($phone["type"] == "Mobile" && $result["mobile_phone"] == '')
            {
                $result["mobile_phone"] = $phone["number"];
            }
        }

        return $result;
    }

    // Make sure these are two digit abbreviations, using google api, upon failure return empty string

    private function normalizeState($state)
    {
        $state = urlencode($state);

        // Need an api key if usage rates go to high of course!

        $json = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address=".$state."&sensor=false"/*&key=...*/);

        $state = "";

        $info = json_decode($json)->results[0];

        foreach ($info->address_components as $c)
        {
            if (in_array("administrative_area_level_1", $c->types))
            {
                $state = $c->short_name;
                break;
            }
        }

        return $state;
    }

    private function useLedger($dataset)
    {
        $this->load->model("amt/datasets");

        $connection = $this->datasets->connection($dataset);

        $this->ledger = $this->load->database($connection, true);
    }

    // Convert from format returned by 'contacts' model to the format used by most
    // other model methods

    public function massageProducts($products)
    {
        $massaged = [];
        foreach ($products as $name => $ordered)
        {
            if ($ordered == true)
            {
                $temp = new stdClass();
                $temp->id = $name;
                $massaged[] = $temp;
            }
        }

        return $massaged;
    }

    // $contactID is from infusionsoft

    public function activateProductionMLS($contactID)
    {
        $keys = $this->getKeys($contactID);

        if (count($keys) < 1)
        {
            return new Fault("Unable to activate the production MLS market. This customer/contact does NOT appear to have an associated license key.");
        }
        else
        {
            $this->useLedger("prod"); // targeting their production license

            foreach($keys as $key)
            {
                $this->ledger->query("update tags set enabled='1'
                                      where scope='global' and tag_name='licensed_markets'
                                      and member_type='licenses' and member_id=?", $key);

                // Don't forget MLS ID's
                $this->ledger->query("update license_mls_agents set enabled='1' where license_key=?", $key);
                $this->ledger->query("update license_mls_offices set enabled='1' where license_key=?", $key);
            }
            return true;
        }
    }

    public function cancel($infusionsoftID)
    {
        $keys = $this->getKeys($infusionsoftID);

        if (count($keys) < 1)
        {
            return new Fault("Unable to make cancellations within the dashboard. This customer/contact does NOT appear to have an associated license key.");
        }
        else
        {
            $this->load->model("amt/datasets");

            // Must deactivate in all three datasets

            $datasets = $this->datasets->describe();

            $this->load->model("amt/licenses");

            $results = true;

            foreach ($datasets as $dataset)
            {
                foreach ($keys as $key)
                {
                    $temp = new stdClass();
                    $temp->license_key = $key;
                    $result = $this->licenses->disable($dataset["clientName"], $temp); // This method handles ALOT of dirty work, even disables user accounts for license

                    if ($result instanceof Fault)
                    {
                        $results = new Fault("Failed to completely cancel licenses for the contact in the dashboard.");
                    }
                }
            }

            return $results;
        }
    }

    public function getKeys($infusionsoftID)
    {
        $keys = [];

        // Get keys associated with the infusionsoft contact
        $query = $this->dash->query("select cl.license_key from customers as c, customer_licenses as cl
                                          where cl.customer_id=c.id and c.infusionsoft_id=?", $infusionsoftID);

        foreach($query->result() as $row)
        {
            $keys[] = $row->license_key;
        }

        return $keys;
    }

    public function disableProducts($infusionsoftID, $products)
    {
        $keys = $this->getKeys($infusionsoftID);

        if (count($keys) < 1)
        {
            return new Fault("Unable to make cancellations within the dashboard. This customer/contact does NOT appear to have an associated license key.");
        }
        else
        {
            $this->load->model("amt/datasets");

            // Must deactivate in all three datasets

            $datasets = $this->datasets->describe();

            $this->load->model("amt/products");

            $results = true;

            foreach ($datasets as $dataset)
            {
                foreach ($keys as $key)
                {
                    foreach ($products as $product)
                    {
                        $temp = new stdClass();
                        $temp->license_key = $key;
                        $temp->id = $product;
                        $result = $this->products->disable($dataset["clientName"], $temp);

                        if (!$result)
                        {
                            $results = new Fault("All products in the dashboard were NOT successfully disabled!");
                        }
                    }
                }
            }
            return $results;
        }
    }
}

