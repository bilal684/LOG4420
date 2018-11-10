var express = require("express")
var router = express.Router()
var validator = require("validator")
var mongoose = require("mongoose")
var Product = mongoose.model("Product")
let utilities = require("./utilities")

router.get("/", function(req, res) 
{	
    if (Object.keys(req.query).length > 0)
    {
        let category = req.query.category
        let criteria = req.query.criteria
        if(category && criteria)
        {
            if((category === "cameras" || category === "computers" || category === "consoles" || category === "screens" || category === "all") &&
                (criteria === "alpha-asc" || criteria === "alpha-dsc" || criteria === "price-asc" || criteria === "price-dsc"))
            {
                Product.find({"category" : category}, function(err,products)
				{  
                    utilities.sortProducts(criteria, products)
					res.status(200)
			        res.json(products)
					res.end()
			    });
            }
			else
			{
                return res.status(400).send("Invalid category or criteria.")
			}
        }
        else if(category)
        {
            if (category === "cameras" || category === "computers" || category === "consoles" || category === "screens") 
			{
                Product.find({"category" : category}, function(err,products) 
				{ 
                    utilities.sortProducts("price-asc", products)
					res.status(200)
			        res.json(products)
					res.end()
			    });
			}
			else
			{
                return res.status(400).send("Invalid category.")
			}
        }
        else if (criteria)
        {
            if (criteria === "alpha-asc" || criteria === "alpha-dsc" || criteria === "price-asc" || criteria === "price-dsc")
			{
                Product.find({}, function(err,products)
				{  
                    utilities.sortProducts(criteria, products)
					res.status(200)
			        res.json(products)
					res.end()
			    });
			}
			else
			{
                return res.status(400).send("Invalid criteria.")
			}
        }
        else
        {
            return res.status(400).send("Allowed parameters are criteria and category.")
        }
    }
    else
    {
        Product.find({}, function(err, products)
        {
            utilities.sortProducts("price-asc", products)
            res.status(200)
            res.json(products)
            res.end()
        });
    }
});

router.get("/:id", function(req, res) 
{
	var ID = req.params.id;
    Product.findOne({id : ID},function(err,product)
    { 
        if (product === null)
        {
    		return res.status(404).send("Product not found.");
        }
    	res.status(200)
        res.json(product)
		res.end()
    });

});

module.exports = router