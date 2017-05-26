import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connectDynamic } from "../../../lib/swagger";
import URLService from "../../../service/URLService"
import _ from 'lodash';
import './groupAssignment.css';

class GroupAssignment extends Component {

    componentWillMount = () => {
      this.searchGroups();
    }

    getSearchParams = () => {
      return {
        include_search: URLService.getQueryParameterAsString("group_search") || ""
      }
    }

    searchGroups = () => {
        this.props.actions.groupsSearchListRequest(this.getSearchParams())
    }

    handleGroupClick = (group) => {
        URLService.setQueryParameter("group", group.id);
        this.searchUsers();
    }

    handleUserClick = (user) => {
        URLService.setQueryParameter("user", user.id);
        //this.searchUsers();
    }

    searchUsers = () => {
        this.props.actions.usersSearchListRequest({
            include_group_id: URLService.getQueryParameterAsInt("group"),
            include_search: URLService.getQueryParameterAsString("user_search") || ""
        })
    }

    handleGroupSearchChange = (ev) => {
        URLService.setQueryParameter("group_search", ev.target.value);
        this.searchGroups();
    }

    handleUserSearchChange = (ev) => {
        URLService.setQueryParameter("user_search", ev.target.value);
        this.searchUsers();
    }

    render = () => {

        const groups = this.props.groupsData ? this.props.groupsData.latest.groups : null;
        const users = this.props.usersData ? this.props.usersData.latest.users : null;

        console.log("props",this.props);
        console.log("groups",groups);
        console.log("users",users);

        return (
          <table className="group-assignment">
              <tbody><tr>
              <td className="groups">
                  <div className="side-header">
                      <input className="search-field" type="text" placeholder="Search Groups" onChange={(ev) => this.handleGroupSearchChange(ev)} value={URLService.getQueryParameterAsString("group_search") || ""} />
                  </div>
                  <div className="groups-list">
                      <div key={group.id} className="groups-list-item groups-list-item-selected" onClick={() => this.handleGroupClick(group)}>
                          
                      </div>
                      {groups && groups.length>0 ? _.map(groups, (group)=> {
                          return (
                              <div key={group.id} className="groups-list-item" onClick={() => this.handleGroupClick(group)}>
                                  {group.name}
                              </div>
                          );
                      }) : null}
                  </div>
              </td>
              <td className="users">
                <div className="side-header">
                    <input className="search-field" type="text" placeholder="Search Users" onChange={(ev) => this.handleUserSearchChange(ev)} value={URLService.getQueryParameterAsString("user_search") || ""} />
                </div>
                  {users && users.length>0 ? _.map(users, (user)=> {
                      console.log(user);
                      return (
                          <div key={user.id} className="users-list-item" onClick={() => this.handleUserClick(user)}>
                              {user.name}
                          </div>
                      );
                  }) : null}
              </td>
              </tr></tbody>
          </table>
        )

    }
}

export default connectDynamic((dynamic, state, props) => {
  return {
    groupsData: dynamic.api.selectors.getGroupsSearchListData(state.api),
    usersData: dynamic.api.selectors.getUsersSearchListData(state.api),
    //echoLoading: dynamic.api.selectors.getDefaultEchoTestLoading(state.api),
    //echoError: dynamic.api.selectors.getDefaultEchoTestError(state.api)
  }
},(dynamic, dispatch, props) => {
  return {
    actions: bindActionCreators(dynamic.api.actions, dispatch)
  }
})(GroupAssignment)