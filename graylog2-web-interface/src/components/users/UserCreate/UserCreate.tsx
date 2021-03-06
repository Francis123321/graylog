/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
import * as React from 'react';
import * as Immutable from 'immutable';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { PluginStore } from 'graylog-web-plugin/plugin';

import type { DescriptiveItem } from 'components/common/PaginatedItemOverview';
import User from 'logic/users/User';
import UsersDomain from 'domainActions/users/UsersDomain';
import PaginatedItem from 'components/common/PaginatedItemOverview/PaginatedItem';
import RolesSelector from 'components/permissions/RolesSelector';
import { Alert, Col, Row, Button, ButtonToolbar } from 'components/graylog';
import { Input } from 'components/bootstrap';
import { Spinner } from 'components/common';
import history from 'util/History';
import Routes from 'routing/Routes';
import AppConfig from 'util/AppConfig';

import TimezoneFormGroup from './TimezoneFormGroup';
import TimeoutFormGroup from './TimeoutFormGroup';
import FirstNameFormGroup from './FirstNameFormGroup';
import LastNameFormGroup from './LastNameFormGroup';
import EmailFormGroup from './EmailFormGroup';
import PasswordFormGroup, { validatePasswords } from './PasswordFormGroup';
import UsernameFormGroup from './UsernameFormGroup';

import { Headline } from '../../common/Section/SectionComponent';

const isCloud = AppConfig.isCloud();

const oktaUserForm = isCloud ? PluginStore.exports('cloud')[0].oktaUserForm : null;

const _onSubmit = (formData, roles, setSubmitError) => {
  let data = { ...formData, roles: roles.toJS(), permissions: [] };
  delete data.password_repeat;

  if (isCloud && oktaUserForm) {
    const { onCreate } = oktaUserForm;
    data = onCreate(data);
  } else {
    data.username = data.username.trim();
  }

  setSubmitError(null);

  return UsersDomain.create(data).then(() => {
    history.push(Routes.SYSTEM.USERS.OVERVIEW);
  }, (error) => setSubmitError(error));
};

const _validate = (values) => {
  let errors = {};

  const { password, password_repeat: passwordRepeat } = values;

  if (isCloud && oktaUserForm) {
    const { validations: { password: validateCloudPasswords } } = oktaUserForm;

    errors = validateCloudPasswords(errors, password, passwordRepeat);
  } else {
    errors = validatePasswords(errors, password, passwordRepeat);
  }

  return errors;
};

type RequestError = { additional: { res: { text: string }}};

const UserCreate = () => {
  const initialRole = { name: 'Reader', description: '为每个 Graylog 用户授予基本权限（内置）', id: '' };
  const [users, setUsers] = useState<Immutable.List<User> | undefined>();
  const [user, setUser] = useState(User.empty().toBuilder().roles(Immutable.Set([initialRole.name])).build());
  const [submitError, setSubmitError] = useState<RequestError | undefined>();
  const [selectedRoles, setSelectedRoles] = useState<Immutable.Set<DescriptiveItem>>(Immutable.Set([initialRole]));

  useEffect(() => {
    UsersDomain.loadUsers().then(setUsers);
  }, []);

  const _onAssignRole = (roles: Immutable.Set<DescriptiveItem>) => {
    setSelectedRoles(selectedRoles.union(roles));
    const roleNames = roles.map((r) => r.name);

    return Promise.resolve(
      setUser(user.toBuilder().roles(user.roles.union(roleNames)).build()),
    );
  };

  const _onUnassignRole = (role: DescriptiveItem) => {
    setSelectedRoles(selectedRoles.remove(role));
    setUser(user.toBuilder().roles(user.roles.remove(role?.name)).build());
  };

  const _handleCancel = () => history.push(Routes.SYSTEM.USERS.OVERVIEW);
  const hasValidRole = selectedRoles.size > 0 && selectedRoles.filter((role) => role.name === 'Reader' || role.name === 'Admin');

  const getUserNameGroup = () => {
    if (isCloud && oktaUserForm) {
      const { fields: { username: CloudUserNameFormGroup } } = oktaUserForm;

      return (
        <>
          {CloudUserNameFormGroup && <CloudUserNameFormGroup />}
        </>
      );
    }

    return (
      <>
        <UsernameFormGroup users={users} />
      </>
    );
  };

  const getEmailGroup = () => {
    if (isCloud && oktaUserForm) {
      const { fields: { email: CloudEmailFormGroup } } = oktaUserForm;

      return (
        <>
          {CloudEmailFormGroup && <CloudEmailFormGroup /> }
        </>
      );
    }

    return (
      <>
        <EmailFormGroup />
      </>
    );
  };

  const getPasswordGroup = () => {
    if (isCloud && oktaUserForm) {
      const { fields: { password: CloudPasswordFormGroup } } = oktaUserForm;

      return <CloudPasswordFormGroup />;
    }

    return <PasswordFormGroup />;
  };

  if (!users) {
    return <Spinner />;
  }

  const showSubmitError = (errors) => {
    if (isCloud && oktaUserForm) {
      const { extractSubmitError } = oktaUserForm;

      return extractSubmitError(errors);
    }

    return errors?.additional?.res?.text;
  };

  return (
    <Row className="content">
      <Col lg={8}>
        <Formik onSubmit={(data) => _onSubmit(data, user.roles, setSubmitError)}
                validate={_validate}
                initialValues={{}}>
          {({ isSubmitting, isValid }) => (
            <Form className="form form-horizontal">
              <div>
                <Headline>轮廓</Headline>
                <FirstNameFormGroup />
                <LastNameFormGroup />
                {getUserNameGroup()}
                {getEmailGroup()}
              </div>
              <div>
                <Headline>设置</Headline>
                <TimeoutFormGroup />
                <TimezoneFormGroup />
              </div>
              <div>
                <Headline>角色</Headline>
                <Input id="roles-selector-input"
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9"
                       label="分配角色">
                  <RolesSelector onSubmit={_onAssignRole} assignedRolesIds={user.roles} identifier={(role) => role.name} />
                </Input>

                <Input id="selected-roles-overview"
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9"
                       label="选定的角色">
                  <>
                    {selectedRoles.map((role) => (
                      <PaginatedItem item={role}
                                     onDeleteItem={(data) => _onUnassignRole(data)}
                                     key={role.id} />
                    ))}
                    {!hasValidRole && <Alert bsStyle="danger">您需要至少选择 <em>Reader</em> 或 <em>Admin</em> 角色之一。</Alert>}
                  </>
                </Input>
              </div>
              <div>
                <Headline>密码</Headline>
                {getPasswordGroup()}
              </div>
              {submitError && (
                <Row>
                  <Col xs={9} xsOffset={3}>
                    <Alert bsStyle="danger">
                      <b>Failed to create user</b><br />
                      {showSubmitError(submitError)}
                    </Alert>
                  </Col>
                </Row>
              )}
              <Row>
                <Col md={9} mdOffset={3}>
                  <ButtonToolbar>
                    <Button bsStyle="success"
                            disabled={isSubmitting || !isValid || !hasValidRole}
                            title="Create User"
                            type="submit">
                      创建用户
                    </Button>
                    <Button type="button" onClick={_handleCancel}>取消</Button>
                  </ButtonToolbar>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default UserCreate;
