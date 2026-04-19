class_name Message extends Node

enum Type { BEGIN_APPROACH = 0, CLEAR_FOR_LANDING = 1, TAXI }

var description : String = "Message"
var type : Message.Type
