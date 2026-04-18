class_name Runway extends Node2D

@export var approach_container: Node2D
@export var title : String
@export var number : String
@export var input : Key

var approach_points: Array[Approach]

func _ready():
	var approaches = approach_container.get_children()
	
	for approach in approaches:
		var approach_node = approach as Approach
		if approach_node != null:
			approach_points.append(approach_node)
	
	print("Runway built with " + str(approach_points.size()) + " approach paths")
	
func approach_vector(approach: Node2D) -> Vector2: 
	return self.global_position - approach.global_position
	
func perpendicular_vector(approach: Node2D) -> Vector2:
	var approach_vec = self.approach_vector(approach)
	return approach_vec.rotated(0.5*PI)


func _on_area_2d_body_entered(body: Node2D) -> void:
	var aircraft = body.get_parent() as Aircraft
	if aircraft != null and aircraft.effective_approach_state() == Aircraft.ApproachState.REACH_APPROACH:
		aircraft.approach_reached()


func _on_runway_area_body_exited(body: Node2D) -> void:
	print("BODY EXITED...")
	var aircraft = body.get_parent() as Aircraft

	if aircraft != null:
		print("BODY IS AIRCRAFT...")
		var effective_state = aircraft.effective_approach_state()
		
		if effective_state == Aircraft.ApproachState.LANDING_VECTOR or effective_state == Aircraft.ApproachState.MATCH_VEC:
			aircraft.set_approach_state(Aircraft.ApproachState.MATCH_OPPOSITE_VEC)
