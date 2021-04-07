import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	ReorderItemsByCriteria_Transaction,
	EditItem_Transaction,
	ReorderList_Transaction} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';


const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [canUndo, setUndo]                = useState(false);
	const [canRedo, setRedo]                = useState(false);
	const [ctrl, setCtrl]              = useState(false);
	const [y, setY]                    = useState(false);
	const [z, setZ]                    = useState(false);

	const [ReorderList]             = useMutation(mutations.REORDER_LIST);
	const [ReorderItemsByCriteria]  = useMutation(mutations.REORDER_ITEMS_BY_CRITERIA);
	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	// const [ChangeIsSelected]         = useMutation(mutations.CHANGE_IS_SELECTED);

	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	// if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		todolists = data.getAllTodos;
		// for (let i = 0; i < todolists.length; i++){
		// 	if (todolists[i].isSelected === true){
		// 		closeActiveList(todolists[i]._id);
		// 	}
		// }
	}

	console.log(activeList.items);

	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		pollUndo();
		pollRedo();
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		pollUndo();
		pollRedo();
		return retVal;
	}

	const pollUndo = async () => {
		const retVal = await props.tps.hasTransactionToUndo();
		if (retVal) setUndo(true);
		else setUndo(false);
	}

	const pollRedo = async () => {
		const retVal = await props.tps.hasTransactionToRedo();
		if (retVal) setRedo(true);
		else setRedo(false);
	}


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		const lastID = items.length >= 1 ? items.length : 0;
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'No User', // props.user._id,
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const reorder = async(isAscending, criteria, items) => {
		//remove typename cuz it sucks
		let cleanedItems = items.map(({ __typename, ...rest}) => rest);
		let listID = activeList._id;
		let transaction = new ReorderItemsByCriteria_Transaction(listID, isAscending, criteria, cleanedItems, ReorderItemsByCriteria);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const createNewList = async (activeId) => {
		const length = todolists.length
		const id = length >= 1 ? todolists[length - 1].id + 1 : 0;
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			isSelected: false,
			owner: props.user._id,
			items: [],
		}
		const { data }  = await AddTodolist({ variables: { todolist: list }/*, refetchQueries: [{ query: GET_DB_TODOS }]*/});
		await refetchTodos(refetch);
		handleSetActive(data.addTodolist, activeId);
	};

	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
		props.tps.clearAllTransactions();
		pollUndo();
		pollRedo();
	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const handleSetActive = async (_id, activeId) => {
		props.tps.clearAllTransactions();
		pollUndo();
		pollRedo();
		const todo = todolists.find(todo => todo._id === _id);
		// const active = todolists.find(todo => todo.isSelected === true);
		// if (active){
		// 	await ChangeIsSelected({ variables: {_id: active._id, isActive: false }});
		// }
		// if (activeId !== undefined) {
		// 	await ChangeIsSelected({ variables: { _id: activeId, isActive: false }});
		// }
		// await ChangeIsSelected({ variables: { _id: _id, isActive: true }, refetchQueries: [{ query: GET_DB_TODOS}] });
		await ReorderList({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS}] });
		setActiveList(todo);
	};

	const closeActiveList = async (activeId) => {
		props.tps.clearAllTransactions();
		pollUndo();
		pollRedo();
		// await ChangeIsSelected({ variables: { _id: activeId, isActive: false}, refetchQueries: [{ query: GET_DB_TODOS}]});
		setActiveList({});
	}

	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
	};

	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.key === 'Control') {
			  setCtrl(true);
			} 
			if (e.key === 'y') {
			  if (ctrl && canRedo) tpsRedo();
			  setY(true);
			} 
			if (e.key === 'z') {
			  if (ctrl && canUndo) tpsUndo();
			  setZ(true);
			} 
		  }
		  document.onkeyup = (e) => {
			if (e.key === 'Control') {
			  setCtrl(false);
			} 
			if (e.key === 'y') {
			  setY(false);
			} 
			if (e.key === 'z') {
			  setZ(false);
			} 
		  }
		return () => {}
	});

	return (
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								todolists={todolists} activeid={activeList._id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								updateListField={updateListField}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									addItem={addItem} deleteItem={deleteItem} editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									activeList={activeList} closeActiveList={closeActiveList}
									reorder={reorder}
									undo={tpsUndo} redo={tpsRedo}
									canUndo={canUndo} canRedo={canRedo}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>

			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;