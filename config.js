// app.post('/profile', upload.single('image'), async (req, res) => {
//     const imagePath = req.file?.path;
//     const { title, description, date } = req.body;

//     cloudinary.uploader
//         .upload(imagePath)
//         .then(result => {
//             const imageUrl = result.url;
//             const eventInfo = {
//                 title, description, date, imageUrl
//             }
//             if (result.asset_id) {
//                 const result = eventsCollection.insertOne(eventInfo);
//                 if (result) {
//                     res.send(result)
//                 }
//             }
//         });
// })