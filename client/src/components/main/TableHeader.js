import React, { useState } from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const [isTaskAscending, taskToggleAscending] = useState(true);
    const [isDueDateAscending, dueDateToggleAscending] = useState(true);
    const [isStatusAscending, statusToggleAscending] = useState(true);

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const headerStyle = props.disabled ? ' table-header-section-disabled ' : ' table-header-section ';
    const clickDisabled = () => { };

    
    const taskReorder = () => {
        props.reorderByTask(isTaskAscending);
        taskToggleAscending(!isTaskAscending);
    }

    const dueDateReorder = () => {
        props.reorderByDueDate(isDueDateAscending);
        dueDateToggleAscending(!isDueDateAscending);
    }

    const statusReorder = () => {
        props.reorderByStatus(isStatusAscending);
        statusToggleAscending(!isStatusAscending);
    }
    
    let task = <WCol size="4">
                  <WButton onClick={props.disabled ? clickDisabled : taskReorder} className={`${headerStyle}`} wType="texted" >Task</WButton>
               </WCol>;
    let dueDate = <WCol size="3">
                    <WButton onClick={dueDateReorder} className={`${headerStyle}`} wType="texted">Due Date</WButton>
                  </WCol>;

    let status = <WCol size="2">
                   <WButton onClick={statusReorder} className={`${headerStyle}`} wType="texted" >Status</WButton>
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