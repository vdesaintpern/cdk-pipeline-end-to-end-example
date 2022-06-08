const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello API ECS env : " 
            + process.env.ENVNAME 
            + " / secret name for DB : " 
            + process.env.DB_SECRET_NAME,
            status: 200
        });
})

app.listen(port, () => {
    console.log(`started app on port ${port}`)
})