const { model, Schema, ObjectId } = require('mongoose');
const Item = require('./item-model').schema;

const todolistSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
		isSelected: {
			type: Boolean,
			required: false
		},
		items: [Item],
	},
	{ timestamps: true }
);

const Todolist = model('Todolist', todolistSchema);
module.exports = Todolist;