import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {

    const entries = props.activeList ? props.activeList.items : null;
    let length;
    if (entries === undefined) {
        length = 0;
    } else {
        length = entries.length - 1;
    }

    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <TableEntry
                        data={entry} key={entry._id}
                        deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                        editItem={props.editItem}
                        length={length}
                        index={index}
                    />
                ))
            }
            </div>
            : <div className='container-primary' />
        
    );
};

export default TableContents;