const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  const { title, date, time, location, description, postedByName } = req.body;
  try {
    if (!title || !date || !time || !location || !description || !postedByName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const event = new Event({
      title,
      date,
      time,
      location,
      description,
      postedBy: req.userId,
      postedByName,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ postedBy: req.userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  const { title, date, time, location, description, postedByName } = req.body;
  try {
    const event = await Event.findOne({ _id: req.params.id, postedBy: req.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }
    event.title = title;
    event.date = date;
    event.time = time;
    event.location = location;
    event.description = description;
    event.postedByName = postedByName;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, postedBy: req.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};