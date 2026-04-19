class_name AirfieldRoot extends Node2D

@export var airfield_name : String
@export var day_name : String

func score_key() -> String:
	return airfield_name + "_" + day_name
