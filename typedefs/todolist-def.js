const { gql } = require('apollo-server');

//getSortedTodo: Todolist
const typeDefs = gql `
	type Todolist {
		_id: String!
		name: String!
		id: Int!
		owner: String!
		isSelected: Boolean!
		items: [Item]
	}
	type Item {
		_id: String!
		id: Int!
		description: String!
		due_date: String!
		assigned_to: String!
		completed:  Boolean!
	}
	extend type Query {
		getAllTodos: [Todolist]
		getTodoByObjectId(_id: String!): Todolist 
		getTodoById(id: Int!): Todolist
	}
	extend type Mutation {
		addItem(item: ItemInput!, _id: String!, index: Int!): String
		addTodolist(todolist: TodoInput!): String
		deleteItem(itemId: String!, _id: String!): [Item]		
		deleteTodolist(_id: String!): Boolean
		updateTodolistField(_id: String!, field: String!, value: String!): String
		updateItemField(itemId: String!, _id: String!, field: String!, value: String!, flag: Int!): [Item]
		reorderItems(itemId: String!, _id: String!, direction: Int!): [Item]
		reorderItemsByCriteria(_id: String!, isAscending: Boolean!, criteria: String!, doUndo: String!, items: [ItemInput]! ): [Item]
		# changeIsSelected(_id: String!, isActive: Boolean!): Boolean
		reorderList(_id: String!): [Todolist]
	}
	input FieldInput {
		_id: String
		field: String
		value: String
	}
	input TodoInput {
		_id: String
		name: String
		id: Int
		owner: String
		isSelected: Boolean
		items: [ItemInput]
	}
	input ItemInput {
		_id: String
		id: Int
		description: String
		due_date: String
		assigned_to: String
		completed:  Boolean
	}
`;

module.exports = { typeDefs: typeDefs }