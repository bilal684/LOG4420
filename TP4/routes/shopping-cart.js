let express = require("express")
let router = express.Router()
let validator = require("validator")
let mongoose = require("mongoose")
let Product = mongoose.model("Product")
let utilities = require("./utilities")
let session = require("express-session")

router.get("/", function(req, res)
{
    if(req.session.order)
    {
        if(req.session.order.length > 0)
        {
            res.status(200).send(JSON.parse(req.session.order)).end()
        }
        else
        {
            res.status(200).send(req.session.order).end()
        }
    }
    else
    {
        req.session.order = []
        res.status(200).send(req.session.order).end()

    }
})

router.get("/:productId", function(req, res)
{
    let id = req.params.productId
    let isInShoppingCart = false

    if(req.session.order)
    {
        let allShoppingCartProducts = JSON.parse(req.session.order)
        for(product of allShoppingCartProducts)
        {
            if(product.productId === id)
            {
                isInShoppingCart = true
                res.status(200).json(product).end()
            }
        }
        if(!isInShoppingCart)
        {
            res.status(404).send("Product is not in the shopping cart").end()
        }
    }
    else
    {
        res.status(404).send("Shopping cart is empty").end()
    }
})

router.post("/", function(req, res)
{
    let validId = req.body.productId == parseInt(req.body.productId, 10)

    let productId = JSON.parse(req.body.productId)
    let quantity = JSON.stringify(req.body.quantity)
    if(validId)
    {
        if(validator.isInt(JSON.stringify(productId)))
        {
            Product.count({id:productId}, function(err, count)
            {
                if(count === 0)
                {
                    return res.status(400).send("Specified product id is invalid").end()
                }
                else
                {
                    if(validator.isInt(quantity, {gt:0}))
                    {
                        let newProduct = new Object()
                        newProduct.productId = productId
                        newProduct.quantity = req.body.quantity
                        if(req.session.order && req.session.order.length > 0)
                        {
                            let allProducts = JSON.parse(req.session.order)
                            allProducts.push(newProduct)
                            req.session.order = JSON.stringify(allProducts)
                        }
                        else
                        {
                            let allProducts = []
                            allProducts.push(newProduct)
                            req.session.order = JSON.stringify(allProducts)
                        }
                        return res.status(201).send("Item was added to the shopping cart").end()
                    }
                    else
                    {
                        return res.status(400).send("Specified quantity should be greater than 0").end()
                    }
                }
            })
        }
    }
    else
    {
        return res.status(400).send("Specified product id is invalid.").end()
    }
})

router.put("/:productId", function(req, res)
{
    let id = req.params.productId
    let quantity = req.body.quantity
    let isInShoppingCart = false
    if(validator.isInt(JSON.stringify(quantity), {gt:0}))
    {
        if(req.session.order)
        {
            let allProducts = JSON.parse(req.session.order)
            for(product of allProducts)
            {
                
                if(product.productId == id)
                {
                    isInShoppingCart = true
                    product.quantity = quantity
                    req.session.order = JSON.stringify(allProducts)
                    res.status(204).send("Quantity was updated").end()
                }
            }
            if(!isInShoppingCart)
            {
                res.status(404).send("Product was not found in the shopping cart").end()
            }
        }
        else
        {
            res.status(404).send("Shopping-cart is empty.").end()
        }
    }
    else
    {
        res.status(400).send("Specified quantity is invalid").end()
    }
})

router.delete("/:productId", function(req, res)
{
    let id = req.params.productId
    let isInShoppingCart = false
    if(req.session.order)
    {
        let allProducts = JSON.parse(req.session.order)
        for(product of allProducts)
        {
            if(product.productId === id)
            {
                isInShoppingCart = true
                let indexOfProduct = allProducts.indexOf(product)
                allProducts.splice(indexOfProduct, 1)
                req.session.order = JSON.stringify(allProducts)
                res.status(204).send("Product was removed from the shopping-cart").end()
            }
        }
        if(!isInShoppingCart)
        {
            res.status(404).send("Product withb specified id was not found in the shopping-cart").end()
        }
    }
    else
    {
        res.status(404).send("Shopping-cart is empty").end()
    }
})

router.delete("/", function(req, res)
{
    req.session.order = undefined
    req.status(204).send("All shopping-cart products were successfully deleted.").end()
})

module.exports = router
