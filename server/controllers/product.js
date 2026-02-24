import Product from "../models/product.js"

const createProduct = async (req, res)=>{
    try{
        const product = await Product.create(req.body);
        res.status(201).json({message:"Product created", product})
    }catch(err){
        res.status(500).json({message:"Server error", error: err.message});
    
    }
    };


const getProducts = async (req, res)=>{
    try{
        const products = await Product.find({isActive: true})
        .populate("baseUnit")
        .populate("units.unit")
        res.status(200).json({message:"Products retrieved", products})

    }catch(err){
        res.status(500).json({message:"Server error", error: err.message});
    }
}


const getProduct = async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id)
        .populate("baseUnit")
        .populate("units.unit")

        if(!product){
            return res.status(404).json({message:"Product not found"})   
        }
        res.status(200).json({message:"Product retrieved", product})
    } catch(err){
        res.status(500).json({message:"Server error", error: err.message});
    }
}


const updateProduct = async (req, res)=>{
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        res.status(200).json({message:"Product updated", product})
    }catch(err){
        res.status(500).json({message:"Server error", error: err.message});
    }
}


const deleteProduct = async(req, res)=>{
    try{
        await Product.findByIdAndUpdate(req.params.id, {isActive: false})
        res.status(200).json({message:"Product deleted"})
    }
    catch(err){
        res.status(500).json({message:"Server error", error: err.message});
    }
}

export {createProduct, getProducts, getProduct, updateProduct, deleteProduct}
