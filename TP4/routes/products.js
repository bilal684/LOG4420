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
            if ( category !== "cameras" && category !== "computers" && category !== "consoles" && category !== "screens" &&
            criteria !== "alpha-asc" && criteria !== "alpha-dsc" && criteria !== "price-asc" && criteria !== "price-dsc")
			{
				return res.status(400).send("Invalid category or criteria.")
			}
			else
			{
				Product.find({"category" : category}, function(err,products)
				{  
                    utilities.sortProducts(criteria, products)
					res.status(200)
			        res.json(products)
					res.end()
			    });
			}
        }
        else if(category)
        {
            if ( category !== "cameras" && category !== "computers" && category !== "consoles" && category !== "screens") 
			{
				return res.status(400).send("Invalid category.")
			}
			else
			{
				Product.find({"category" : category}, function(err,products) 
				{ 
                    utilities.sortProducts("price-asc", products)
					res.status(200)
			        res.json(products)
					res.end()
			    });
			}
        }
        else if (criteria)
        {
            if (criteria !== "alpha-asc" && criteria !== "alpha-dsc" && criteria !== "price-asc" && criteria !== "price-dsc")
			{
				return res.status(400).send("Invalid criteria.")
			}
			else
			{
				Product.find({"category" : category}, function(err,products)
				{  
                    utilities.sortProducts(criteria, products)
					res.status(200)
			        res.json(products)
					res.end()
			    });
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

module.exports = router