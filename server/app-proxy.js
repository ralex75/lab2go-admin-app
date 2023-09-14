const express=require("express")
const { createProxyMiddleware } = require('http-proxy-middleware');
const history=require("express-history-api-fallback-middleware")
const path=require("path")
const app=express()
const PORT=5000 //DEFAULT LISTENING PORT
app.use(express.static(path.join(__dirname, './../dist')))

app.use(history())

app.get("/",(req,res)=>{
    const path=require('path')
    
    res.sendFile(path.join(__dirname,'./../dist/index.html'))

})

app.use('/api', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));


app.listen(PORT,()=>{
    console.log("Proxy server UP on port:"+PORT)
}); 