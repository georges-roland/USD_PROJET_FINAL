import * as supportService from './support.service.js';

export const sendMessage = async (req, res) => {
  try {
    const { email, message, sender } = req.body;
    await supportService.sendMessage(email, message, sender || 'client');
    res.status(201).json({ success: true, message: 'Message envoyé' });
  } catch (err) { 
    res.status(500).json({ success: false }); 
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await supportService.getMessages();
    res.status(200).json({ success: true, messages });
  } catch (err) { 
    res.status(500).json({ success: false }); 
  }
};

export const getMyMessages = async (req, res) => {
  try {
    const messages = await supportService.getMyMessages(req.user.email);
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await supportService.markAsRead(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) { 
    res.status(500).json({ success: false }); 
  }
};
