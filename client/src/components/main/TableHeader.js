import React, { useState } from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const [taskAscending, taskToggleAscending] = useState(true);

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const headerStyle = props.disabled ? ' table-header-section-disabled ' : ' table-header-section ';
    const clickDisabled = () => { };

    
    const taskReorder = () => {
        console.log(taskAscending);
        props.reorderByTask(taskAscending);
        taskToggleAscending(!taskAscending);
    }
    // 
    let task = <WCol size="4">
                  <WButton onClick={props.disabled ? clickDisabled : taskReorder} className={`${headerStyle}`} wType="texted" >Task</WButton>
               </WCol>;
    let dueDate = <WCol size="3">
                    <WButton /*onClick={dueDateReorder}*/ className={`${headerStyle}`} wType="texted">Due Date</WButton>
                  </WCol>;

    let status = <WCol size="2">
                   <WButton /*onClick={statusReorder}*/ className={`${headerStyle}`} wType="texted" >Status</WButton>
                 </WCol>;
    
    return (
        <WRow className="table-header">
            
            {task}

            {dueDate}
            
            {status}

            <WCol size="3">
                <div className="table-header-buttons">
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => props.setActiveList({})} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;