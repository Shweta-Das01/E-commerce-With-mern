import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const CategorySchema=new Schema({
    name:{
        type: String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images:{
            type:String,
            default :"https://picsum.photos/200/300",
            required: true,
        },
    products: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "Product",
    },
],
},
{ timestamps: true}
);
//compile the schema to model

const Category=mongoose.model('Category',CategorySchema);

export default Category;