const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const eventSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
});

const Event = mongoose.model('Event', eventSchema);

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
});
app.delete('/api/events/:id', async (req, res) => {
    const eventId = req.params.id;
  
    try {
      await Event.findByIdAndDelete(eventId);
      res.json({ message: 'Event deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  });

app.post('/api/events', async (req, res) => {
  const { title, start, end } = req.body;

  try {
    const event = new Event({ title, start, end });
    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});