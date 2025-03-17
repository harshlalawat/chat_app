import Message from "../models/message.model.js";


export const getMessages = async (req, res) => {
    try{
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({$or: [{sender: myId, receiver: userToChatId}, {sender: userToChatId, receiver: myId}]});
        return res.status(200).json(messages);
    }catch(error){
        console.log(`Error in get messages controller : ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}
    
    export const sendMessage = async (req, res) => {
        try{
            const { text, image } = req.body;
            const { id: userToChatId } = req.params;
            const myId = req.user._id;
            let imageURL = null;
            if(image){
                const uploadedResponse = await cloudinary.uploader.upload(image);
                imageURL = uploadedResponse.secure_url;
            }
            const newMessage = new Message({sender: myId, receiver: userToChatId, text, imageURL});
            newMessage.save();
            // todo real time sending

            return res.status(200).json({message: "Message Received"});
        }catch(error){
            console.log(`Error in message controller : ${error.message}`);
            res.status(500).json({message: "Internal Server Error"});
        }
    }