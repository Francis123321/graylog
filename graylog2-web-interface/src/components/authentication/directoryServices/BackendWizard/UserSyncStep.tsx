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
import { useContext } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';

import Role from 'logic/roles/Role';
import { validateField, formHasErrors } from 'util/FormsUtils';
import { Alert, Button, ButtonToolbar, Row, Col, Panel } from 'components/graylog';
import { Icon, FormikFormGroup, Select } from 'components/common';
import { Input } from 'components/bootstrap';

import BackendWizardContext, { WizardFormValues } from './BackendWizardContext';

export const STEP_KEY = 'user-synchronization';
// Form validation needs to include all input names
// to be able to associate backend validation errors with the form
export const FORM_VALIDATION = {
  defaultRoles: { required: true },
  userFullNameAttribute: { required: true },
  userNameAttribute: { required: true },
  userSearchBase: { required: true },
  userSearchPattern: { required: true },
  userUniqueIdAttribute: {},
};

type Props = {
  formRef: React.Ref<FormikProps<WizardFormValues>>,
  help: { [inputName: string]: React.ReactElement | string | null | undefined },
  excludedFields: { [inputName: string]: boolean },
  roles: Immutable.List<Role>,
  onSubmit: () => void,
  onSubmitAll: () => Promise<void>,
  submitAllError: React.ReactNode | null | undefined,
  validateOnMount: boolean,
};

const UserSyncStep = ({ help = {}, excludedFields = {}, formRef, onSubmit, onSubmitAll, submitAllError, validateOnMount, roles }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setStepsState, ...stepsState } = useContext(BackendWizardContext);
  const { backendValidationErrors } = stepsState;
  const rolesOptions = roles.map((role) => ({ label: role.name, value: role.id })).toArray();

  const _onSubmitAll = (validateForm) => {
    validateForm().then((errors) => {
      if (!formHasErrors(errors)) {
        onSubmitAll();
      }
    });
  };

  return (
    <Formik initialValues={stepsState.formValues}
            initialErrors={backendValidationErrors}
            innerRef={formRef}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={validateOnMount}>
      {({ isSubmitting, validateForm }) => (
        <Form className="form form-horizontal">
          <FormikFormGroup help={help.userSearchBase}
                           label="???????????? DN"
                           error={backendValidationErrors?.userSearchBase}
                           name="userSearchBase"
                           placeholder="???????????? DN"
                           validate={validateField(FORM_VALIDATION.userSearchBase)} />

          <FormikFormGroup help={help.userSearchPattern}
                           label="????????????"
                           name="userSearchPattern"
                           error={backendValidationErrors?.userSearchPattern}
                           placeholder="????????????"
                           validate={validateField(FORM_VALIDATION.userSearchPattern)} />

          <FormikFormGroup help={help.userNameAttribute}
                           label="????????????"
                           name="userNameAttribute"
                           error={backendValidationErrors?.userNameAttribute}
                           placeholder="????????????"
                           validate={validateField(FORM_VALIDATION.userNameAttribute)} />

          <FormikFormGroup help={help.userFullNameAttribute}
                           label="????????????"
                           name="userFullNameAttribute"
                           placeholder="????????????"
                           error={backendValidationErrors?.userFullNameAttribute}
                           validate={validateField(FORM_VALIDATION.userFullNameAttribute)} />

          {!excludedFields.userUniqueIdAttribute && (
            <FormikFormGroup help={help.userUniqueIdAttribute}
                             label="????????????"
                             name="userUniqueIdAttribute"
                             placeholder="????????????"
                             error={backendValidationErrors?.userUniqueIdAttribute}
                             validate={validateField(FORM_VALIDATION.userUniqueIdAttribute)} />
          )}

          <Row>
            <Col sm={9} smOffset={3}>
              <Panel bsStyle="info">
                ??????????????????????????????????????????{stepsState.authBackendMeta.serviceTitle}????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????
              </Panel>
            </Col>
          </Row>

          <Field name="defaultRoles" validate={validateField(FORM_VALIDATION.defaultRoles)}>
            {({ field: { name, value, onChange, onBlur }, meta: { error } }) => (
              <Input bsStyle={error ? 'error' : undefined}
                     help={help.defaultRoles}
                     error={error ?? backendValidationErrors?.defaultRoles}
                     id="default-roles-select"
                     label="????????????"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9">
                <Select inputProps={{ 'aria-label': 'Search for roles' }}
                        multi
                        onBlur={onBlur}
                        onChange={(selectedRoles) => onChange({ target: { value: selectedRoles, name } })}
                        options={rolesOptions}
                        placeholder="????????????"
                        value={value} />
              </Input>
            )}
          </Field>

          <Row>
            <Col sm={9} smOffset={3}>
              <Alert bsStyle="info">
                <Icon name="info-circle" />{' '}
                ????????????????????????????????????????????????????????????????????????????????????
              </Alert>
            </Col>
          </Row>

          {submitAllError}

          <ButtonToolbar className="pull-right">
            <Button disabled={isSubmitting}
                    onClick={() => _onSubmitAll(validateForm)}
                    type="button">
              ???????????????????????????
            </Button>
            <Button bsStyle="primary"
                    disabled={isSubmitting}
                    type="submit">
              ????????????????????????
            </Button>
          </ButtonToolbar>
        </Form>
      )}
    </Formik>
  );
};

export default UserSyncStep;
