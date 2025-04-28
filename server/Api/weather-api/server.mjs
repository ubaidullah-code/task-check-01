import express from 'express'
import cors from 'cors' 
const app = express()
const port = 5000
app.use(cors())
app.get("/",(req,res)=>{
  res.send("hello world!")
})
app.get('/weather-app/:cityName', (req, res) => {
  const cityName = req.params.cityName.toLowerCase()
  let apiRes = {} // Declare apiRes before switch
console.log(cityName)
  switch (cityName) {
    case "karachi":
      apiRes = {
        city: cityName,
        temperature: 40, 
        humidity: 39, 
        wind: "50 km/h",
        min: 30,
        max: 42,
        feelslike: 45
      }
      break

    case "lahore":
      apiRes = {
        city: cityName,
        temperature: 40, 
        humidity: 39, 
        wind: "50 km/h",
        min: 30,
        max: 42,
        feelslike: 45,
        "image": "https://png.pngtree.com/png-vector/20250321/ourlarge/pngtree-partly-cloudy-with-rain-emoji-png-image_15839963.png"
      }
      break

    case "peshawar":
      apiRes = {
        city: cityName,
        temperature: 40, 
        humidity: 39, 
        wind: "50 km/h",
        min: 30,
        max: 42,
        feelslike: 45,
        image: "https://media.istockphoto.com/id/1386985257/vector/sun-vector-illustration-cartoon-graphic-for-summer-weather-temperature.jpg?s=612x612&w=0&k=20&c=L17kSxvhdTvKWSCUa2miEOjqEYw8N3ab54Dnp_dqMa0="
      }
      break

    default:
      return res.status(404).send({ error: "City not found" }) // Return 404 if city not matched
  }

  res.send(apiRes)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
