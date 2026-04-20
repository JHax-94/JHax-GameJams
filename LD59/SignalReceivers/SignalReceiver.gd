class_name SignalReceiver extends Node2D

func in_range():
	pass
	
func out_of_range():
	pass

func message(message_data: Message):
	print(self.name + " received message: " + message_data.description)
