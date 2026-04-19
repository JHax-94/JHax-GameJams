class_name Approach extends Node2D

@export var input : Key
@export var key_text: String
@export var title : String
@export var taxi_path: TaxiPath

@onready var area_2d: Area2D = $Area2D

func _ready() -> void:
	for i in range(1, 32):
		area_2d.set_collision_layer_value(i, true)
		area_2d.set_collision_mask_value(i, true)
