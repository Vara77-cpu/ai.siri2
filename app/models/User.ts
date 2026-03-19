import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({

name: String,
email: String,
image: String,

progress: [
{
board: String,
classId: String,
subject: String,
unit: String,
lesson: String
}
]

})

export default mongoose.models.User ||
mongoose.model("User", UserSchema)
