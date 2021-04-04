import React, { useState } from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const [isTaskAscending, taskToggleAscending] = useState(true);
    const [isDueDateAscending, dueDateToggleAscending] = useState(true);
    const [isStatusAscending, statusToggleAscending] = useState(true);
    const [isAssignedToAscending, assignedToToggleAscending] = useState(true);


    //TODO: maybe add  clickAnimation="ripple-light"
    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';

    const undoStyle = props.canUndo ? 'table-header-button ' : ' table-header-button-disabled ';
    const redoStyle = props.canRedo ? 'table-header-button ' : ' table-header-button-disabled ';

    const headerStyle = props.disabled ? ' table-header-section-disabled ' : ' table-header-section ';
    const clickDisabled = () => { };

    const taskReorder = () => {
        props.reorder(isTaskAscending, "description");
        taskToggleAscending(!isTaskAscending);
    }

    const dueDateReorder = () => {
        props.reorder(isDueDateAscending, "due_date");
        dueDateToggleAscending(!isDueDateAscending);
    }

    const statusReorder = () => {
        props.reorder(isStatusAscending, "completed");
        statusToggleAscending(!isStatusAscending);
    }

    const assignedToReorder = () => {
        props.reorder(isAssignedToAscending, "assigned_to");
        assignedToToggleAscending(!isAssignedToAscending);
        
    }
    
    let task = <WCol size="3">
                  <WButton onClick={props.disabled ? clickDisabled : taskReorder} className={`${headerStyle}`} wType="texted" >Task</WButton>
               </WCol>;
    let dueDate = <WCol size="2">
                    <WButton onClick={dueDateReorder} className={`${headerStyle}`} wType="texted">Due Date</WButton>
                  </WCol>;

    let status = <WCol size="2">
                   <WButton onClick={statusReorder} className={`${headerStyle}`} wType="texted" >Status</WButton>
                 </WCol>;

    let assigned_to = <WCol size="2">
                    <WButton onClick={assignedToReorder} className={`${headerStyle}`} wType="texted" >Assigned To</WButton>
                </WCol>;
    
    return (
        <WRow className="table-header">
            
            {task}

            {dueDate}
            
            {status}

            {assigned_to}
            <WCol size="1">
                <WRow className="table-header-buttons">
                    <WCol size="1">
                        <WButton className={`${undoStyle}`} onClick={props.canUndo ? props.undo : clickDisabled } wType="texted" shape="rounded">
                            <i className="material-icons">undo</i>
                        </WButton>
                    </WCol> 
                    <WCol size="1">
                        <WButton className={`${redoStyle}`} onClick={props.canRedo ? props.redo : clickDisabled } wType="texted" shape="rounded">
                            <i className="material-icons">redo</i>
                        </WButton>
                    </WCol>
                </WRow>
            </WCol>
       
            <WCol size="2">
                <div className="table-header-buttons">
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => props.closeActiveList(props.activeList._id)} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;