import React            from 'react';
import TableHeader      from './TableHeader';
import TableContents    from './TableContents';

const MainContents = (props) => {
    return (
        <div className='table ' >
            <TableHeader
                disabled={!props.activeList._id} addItem={props.addItem} 
                setShowDelete={props.setShowDelete} closeActiveList={props.closeActiveList} activeList={props.activeList}
                reorder={props.reorder}
                undo={props.undo} redo={props.redo}
                canUndo={props.canUndo} canRedo={props.canRedo}
            />
            <TableContents
                key={props.activeList._id} activeList={props.activeList}
                deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                editItem={props.editItem}
            />
        </div>
    );
};

export default MainContents;