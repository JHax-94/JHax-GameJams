class_name Message extends Node

enum Type { 
	BEGIN_APPROACH = 0, 
	CLEAR_FOR_LANDING = 1, 
	TAXI = 2, 
	HOLDING_PATTERN = 3, 
	CHANGE_ALTITUDE = 4, 
	CHANGE_SPEED = 5,
	ABORT = 6
}

func parse_radius(_str : String) -> Radius:
	var radius = Radius.TIGHT
	match _str:
		"tight":
			radius = Radius.TIGHT
		"wide":
			radius = Radius.WIDE
			
	return radius

func parse_direction(_str: String) -> Direction:
	var dir = Direction.DECREASE
	match _str:
		"decrease":
			dir = Direction.DECREASE
		"increase":
			dir = Direction.INCREASE
	
	return dir
			
enum Radius { TIGHT = 0, WIDE = 1 }
enum Direction { DECREASE = 0, INCREASE = 1 }

var description : String = "Message"
var type : Message.Type
