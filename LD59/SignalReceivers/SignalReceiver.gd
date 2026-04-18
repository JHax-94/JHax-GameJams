class_name SignalReceiver extends Node2D

func message(message_data: Message):
	print(self.name + " received message: " + message_data.description)
