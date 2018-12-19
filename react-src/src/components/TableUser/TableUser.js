import React, { Component } from "react";
import { Table } from "semantic-ui-react";

import ModalUser from "../ModalUser/ModalUser";
import ModalConfirmDelete from "../ModalConfirmDelete/ModalConfirmDelete";

class TableUser extends Component {
  render() {
    let users = this.props.users;

    users = users.map(user => (
      <Table.Row key={user._id}>
        <Table.Cell>{user.deviceName}</Table.Cell>
        <Table.Cell>{user.deviceType}</Table.Cell>
        <Table.Cell>{user.sensorName}</Table.Cell>
        <Table.Cell>{user.dStatus}</Table.Cell>
        <Table.Cell>
          <ModalUser
            headerTitle="Edit Device"
            buttonTriggerTitle="Edit"
            buttonSubmitTitle="Save"
            buttonColor="blue"
            userID={user._id}
            onUserUpdated={this.props.onUserUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
          <ModalConfirmDelete
            headerTitle="Delete Device"
            buttonTriggerTitle="Delete"
            buttonColor="black"
            user={user}
            onUserDeleted={this.props.onUserDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    ));

    // Make every new user appear on top of the list
    users = [...users].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Device Name</Table.HeaderCell>
            <Table.HeaderCell>Device Type</Table.HeaderCell>
            <Table.HeaderCell>Sensor Name</Table.HeaderCell>
            <Table.HeaderCell>Sensor Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{users}</Table.Body>
      </Table>
    );
  }
}

export default TableUser;
