import React            from 'react';
import TableHeader      from './TableHeader';
import TableContents    from './TableContents';

const MainContents = (props) => {
    return (
        <div className='table ' >
            <TableHeader
                disabled={!props.activeList._id} addItem={props.addItem} 
                setShowDelete={props.setShowDelete} closeActiveList={props.closeActiveList} activeList={props.activeList}
                reorderByTask={props.reorderByTask} reorderByDueDate={props.reorderByDueDate} reorderByStatus={props.reorderByStatus}
            />
            <TableContents
                key={props.activeList.id} activeList={props.activeList}
                deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                editItem={props.editItem}
            />
        </div>
    );
};

export default MainContents;