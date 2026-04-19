class_name SignalBuilderUi extends Control

@onready var active_signal: Label = $"signals_ui/MarginContainer/Active Signal/SignalTypeGroup/ActiveSignal"
@onready var runways_container: VBoxContainer = $params_ui/MarginContainer/params_container/runways_container
@onready var approaches_container: VBoxContainer = $params_ui/MarginContainer/params_container/approaches_container
@onready var approach_options: VBoxContainer = $params_ui/MarginContainer/params_container/approaches_container/approach_options
@onready var radius_container: VBoxContainer = $params_ui/MarginContainer/params_container/radius_container
@onready var direction_container: VBoxContainer = $params_ui/MarginContainer/params_container/direction_container
@onready var params_ui: PanelContainer = $params_ui
@onready var send_signal: Button = $SignalReadout/MarginContainer/VBoxContainer/SendSignal
@onready var signal_readout: Label = $SignalReadout/MarginContainer/VBoxContainer/SignalReadout

@export var param_containers : Array[ParamGroup] = []

@export var atc : AtcTower

func _on_signal_builder_signal_type_changed(new_type: String, params: Array, current_signal: Dictionary, signal_valid: bool) -> void:
	if new_type.length() == 0:
		active_signal.text = "-"
	else:
		active_signal.text = new_type
	
	print("Set signal readout text: " + current_signal["readout"])
	signal_readout.text = current_signal["readout"]
	
	send_signal.disabled = !signal_valid
	
	self.runways_container.visible = false
	self.approaches_container.visible = false
	self.radius_container.visible = false
	self.direction_container.visible = false
	
	print("Signal changed: " + new_type)
	print(str(params))
	
	var param_i = 0
	self.params_ui.visible = params.size() > 0
	
	for param in params:
		
		var param_container = self.param_containers[param_i]
		print("Set up param container: " + param_container.name)
		
		var param_name: String = param[0]
		
		param_container.visible = true
		param_container.label.text = param_name[0].to_upper() + param_name.substr(1) + ": "
		
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
				#self.approach_options.remove_child(n)
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

	

func _on_atc_tower_atc_ready(_atc: AtcTower) -> void:
	print("Tower ready!")
	self.atc.signal_builder.signal_type_changed.connect(self._on_signal_builder_signal_type_changed)
	for runway in self.atc.runways:
		var runway_str = runway.number + " - " + runway.title
		var label = Label.new()
		label.text = runway_str
		runways_container.add_child(label)
	self.atc.signal_builder.clear_signal()
		
func _ready() -> void:
	self.atc.atc_ready.connect(self._on_atc_tower_atc_ready)
	self.send_signal.disabled = true
	
	for container in param_containers:
		container.visible = false

func _on_send_signal_pressed() -> void:
	self.atc.send_message()
