import React, { useState } from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const [isTaskAscending, taskToggleAscending] = useState(false);
    const [isDueDateAscending, dueDateToggleAscending] = useState(false);
    const [isStatusAscending, statusToggleAscending] = useState(false);
    const [isAssignedToAscending, assignedToToggleAscending] = useState(false);


    //TODO: maybe add  clickAnimation="ripple-light"
    const buttonStyle = 'table-entry-buttons'; //props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';

    const undoStyle = 'table-entry-buttons ';//props.canUndo ? 'table-entry-buttons ' : ' table-entry-buttons-disabled ';
    const redoStyle = 'table-entry-buttons ';//props.canRedo ? 'table-entry-buttons ' : ' table-entry-buttons-disabled ';

    const headerStyle = props.disabled ? ' table-header-section-disabled ' : ' table-header-section ';
    const clickDisabled = () => { };

    const taskReorder = () => {
        props.reorder(isTaskAscending, "description", props.activeList.items);
        taskToggleAscending(!isTaskAscending);
    }

    const dueDateReorder = () => {
        props.reorder(isDueDateAscending, "due_date", props.activeList.items);
        dueDateToggleAscending(!isDueDateAscending);
    }

    const statusReorder = () => {
        props.reorder(isStatusAscending, "completed", props.activeList.items);
        statusToggleAscending(!isStatusAscending);
    }

    const assignedToReorder = () => {
        props.reorder(isAssignedToAscending, "assigned_to", props.activeList.items);
        assignedToToggleAscending(!isAssignedToAscending);
        
    }
    
    let task = <WCol size="3">
                  <WButton onClick={props.disabled ? clickDisabled : taskReorder} className={`${headerStyle}`} wType="texted" >Task</WButton>
               </WCol>;
    let dueDate = <WCol size="2">
                    <WButton onClick={props.disabled ? clickDisabled : dueDateReorder} className={`${headerStyle}`} wType="texted">Due Date</WButton>
                  </WCol>;

    let status = <WCol size="2">
                   <WButton onClick={props.disabled ? clickDisabled : statusReorder} className={`${headerStyle}`} wType="texted" >Status</WButton>
                 </WCol>;

    let assigned_to = <WCol size="2">
                    <WButton onClick={props.disabled ? clickDisabled : assignedToReorder} className={`${headerStyle}`} wType="texted" >Assigned To</WButton>
                </WCol>;
    
    return (
        <WRow className="table-header">
            
            {task}

            {dueDate}
            
            {status}

            {assigned_to}
            
            <WCol size="3">
                <div className="button-group">
                    <WButton className={`${undoStyle}`} onClick={props.canUndo ? props.undo : clickDisabled } wType="texted" shape="rounded" disabled={!props.canUndo}>
                        <i className="material-icons">undo</i>
                    </WButton>

                    <WButton className={`${redoStyle}`} onClick={props.canRedo ? props.redo : clickDisabled } wType="texted" shape="rounded" disabled={!props.canRedo}>
                        <i className="material-icons">redo</i>
                    </WButton>
                    <div className="button-group">
                        <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`} disabled={props.disabled}>
                            <i className="material-icons">add_box</i>
                        </WButton>
                        <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`} disabled={props.disabled}>
                            <i className="material-icons">delete_outline</i>
                        </WButton>
                        <WButton onClick={props.disabled ? clickDisabled : () => props.closeActiveList(props.activeList._id)} wType="texted" className={`${buttonStyle}`} disabled={props.disabled}>
                            <i className="material-icons">close</i>
                        </WButton>
                    </div>
                </div>
                
            </WCol>


        </WRow>
    );
};

export default TableHeader;