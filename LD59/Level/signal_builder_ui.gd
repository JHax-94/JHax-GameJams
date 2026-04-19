class_name SignalBuilderUi extends Control

@onready var active_signal: Label = $"signals_ui/VBoxContainer/Active Signal/SignalTypeGroup/ActiveSignal"
@onready var runways_container: VBoxContainer = $params_ui/params_container/runways_container
@onready var approaches_container: VBoxContainer = $params_ui/params_container/approaches_container
@onready var approach_options: VBoxContainer = $params_ui/params_container/approaches_container/approach_options
@onready var radius_container: VBoxContainer = $params_ui/params_container/radius_container
@onready var direction_container: VBoxContainer = $params_ui/params_container/direction_container

@export var param_containers : Array[ParamGroup] = []

	

func _on_signal_builder_signal_type_changed(new_type: String, params: Array, current_signal: Dictionary) -> void:
	active_signal.text = new_type
	
	self.runways_container.visible = false
	self.approaches_container.visible = false
	self.radius_container.visible = false
	self.direction_container.visible = false
	
	print("Signal changed: " + new_type)
	print(str(params))
	
	var param_i = 0

	for param in params:
		
		var param_container = self.param_containers[param_i]
		print("Set up param container: " + param_container.name)
		
		var param_name: String = param[0]
		
		param_container.visible = true
		param_container.label.text = param_name + ": "
		
		
		
		param_container.value.text = "-"
		var param_val = null
		if current_signal.has(param_name):
			param_val = current_signal[param_name]
		
		if param[0] == "runway":
			self.runways_container.visible = true
			if param_val:
				param_container.value.text = (param_val as Runway).title
			
		elif param[0] == "approach":
			self.approaches_container.visible = true
			if param_val:
				param_container.value.text = (param_val as Approach).title
			
			var child_nodes = self.approach_options.get_children()
			for n in child_nodes:
				self.approach_options.remove_child(n)
				n.queue_free()
				
			for i in range(1, param.size()):
				print ("Add approach " + str(i))
				var label = Label.new()
				label.text = param[i]
				print("label text=" + label.text)
				self.approach_options.add_child(label)
				
		elif param[0] == "radius":
			radius_container.visible = true
			if param_val:
				param_container.value.text = param_val
			
		elif param[0] == "direction":
			direction_container.visible = true
			if param_val:
				param_container.value.text = param_val
			
		param_i += 1
	
	for i in range(param_i, self.param_containers.size()):
		self.param_containers[i].visible = false

func _on_atc_tower_atc_ready(atc: AtcTower) -> void:
	print("Tower ready!")
	for runway in atc.runways:
		var runway_str = runway.number + " - " + runway.title
		var label = Label.new()
		label.text = runway_str
		runways_container.add_child(label)
