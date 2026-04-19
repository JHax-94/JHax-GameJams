class_name AirfieldRoot extends Node2D

@export var airfield_name : String
@export var day_name : String

func score_key() -> String:
	return SCORE_BOARD.get_score_key(airfield_name, day_name)
