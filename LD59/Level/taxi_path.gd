class_name TaxiPath extends Node2D

@export var waypoints : Array[Area2D]
@export var to_hangar : Area2D

signal node_reached(waypoint: Area2D, body: Node2D)
signal hangar_reached(body: Node2D)

func process_node_reached(waypoint: Area2D, body: Node2D):
	print("Taxi node reached!")
	print(waypoint.name)
	print(body.name)
	self.node_reached.emit(waypoint, body)
	
func process_hangar_reached(body: Node2D):
	self.hangar_reached.emit(body)
	
func _ready() -> void:
	if waypoints.size() == 0:
		print("Taxi path" + self.name + " not configured!!")
	
	for waypoint in waypoints:
		#print("connect " + self.name + "to waypoint event: " + waypoint.name)
		waypoint.body_entered.connect(func(body: Node2D): self.process_node_reached(waypoint, body))
	
	self.to_hangar.body_entered.connect(self.process_hangar_reached)


func first_node() -> Node2D:
	return self.waypoints[0]

func next_node(after_node: Node2D) -> Node2D:
	var return_node: Node2D = null
	var current_index = self.waypoints.find(after_node)
	
	if current_index >= 0 and current_index+1 < self.waypoints.size():
		return_node = self.waypoints[current_index+1]
	
	if return_node == null:
		print("No Node found to follow index " + str(current_index) + " on path " + self.name)
	else:
		print("Next node is " + return_node.name)
	
	return return_node
	
	
	
