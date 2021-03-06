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
import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import CP_logo_darkground from 'images/auth/CP_logo_darkground.png';
import CP_logo_lightground from 'images/auth/CP_logo_lightground.png';

import { themePropTypes } from 'theme';

// Don't pass active prop, since `a` tag doesn't support it.
// eslint-disable-next-line no-unused-vars
function BrandComponent({ active, theme, ...props }) {
  if (theme.mode === 'noir') {
    return (
      <a {...props} className="navbar-brand" style={{padding:'10px 15px'}}>
        {/*yangzy_logo*/}
        <img width="125" height="32" src={CP_logo_darkground} />
        {/*<svg height="26" width="90" viewBox="0 0 891 260" role="img" aria-labelledby="logoTitleId">*/}
        {/*<title id="logoTitleId">Graylog Logo</title>*/}
        {/*<g fill={theme.colors.variant.darker.default}>*/}
        {/*<path d="m77.914 172.424c-20.408 0-42.098-15.11-42.098-43.113 0-20.194 16.033-41.078 42.861-41.078 22.266 0 41.078 19.391 41.078 42.348 0 23.071-18.77 41.843-41.841 41.843zm41.841-101.344c-11.773-9.84-28.009-15.615-45.148-15.615-41.137 0-74.607 33.128-74.607 73.846 0 35.88 28.234 74.606 73.845 74.606 19.851 0 33.7-4.207 45.794-14.489-1.453 25.158-16.388 37.405-45.539 37.405-10.492 0-25.866-3.597-39.528-20.731l-3.544-4.45-27.52 21.792 4.055 4.516c18.34 20.435 39.94 30.368 66.029 30.368 53.385 0 80.453-26.897 80.453-79.948v-119.863h-34.29zm130.157 21.42v-37.035h-5.704c-15.183 0-26.453.918-36.503 10.822v-7.77h-34.292v143.875h34.292v-80.964c0-20.128 9.504-31.673 26.075-31.673 2.836 0 5.91.378 9.141 1.125z" />*/}
        {/*<path d="m309.123 173.95c-20.13 0-31.672-7.56-31.672-20.74s11.542-20.739 31.672-20.739c20.129 0 31.673 7.56 31.673 20.74s-11.544 20.74-31.673 20.74zm-1.779-118.485c-16.552 0-32.908 3.472-49.997 10.614l-5.724 2.39 15.345 29.512 5-2.45c11.943-5.846 22.779-8.572 34.103-8.572 15.492 0 33.96 3.644 33.96 20.992v2.444c-10.258-6.191-22.239-9.418-35.231-9.418-43.399 0-63.165 26.548-63.165 51.218 0 31.35 26.078 53.249 63.418 53.249 14.566 0 26.247-3.305 36.503-10.52v7.468h32.768v-96.22c0-30.803-26.292-50.707-66.98-50.707" />*/}
        {/*<path d="m482.047 58.517-39.15 93.12-38.684-93.12h-38.345l57.581 136.128-27.093 63.683h36.276l86.287-199.81h-36.872" />*/}
        {/*</g>*/}
        {/*<path d="m549.185.003v158.469c0 15.659 7.695 20.97 15.395 20.97h7.168v22.295h-9.824c-22.032 0-36.628-12.477-36.628-41.409v-160.325h23.89m52.475 132.718c0 26.544 22.827 49.903 49.372 49.903 26.544 0 49.371-23.359 49.371-49.903 0-28.665-22.827-50.166-49.37-50.166-26.546 0-49.373 21.501-49.373 50.166zm49.372-72.465c43.532 0 74.856 33.445 74.856 72.465 0 39.55-29.73 72.201-74.856 72.201-45.122 0-74.854-32.65-74.854-72.2 0-39.02 31.32-72.466 74.854-72.466m167.347 22.299c-32.385 0-50.703 25.746-50.703 48.84 0 31.853 24.952 50.965 49.903 50.965 27.344 0 49.639-22.032 49.639-49.639 0-27.87-22.827-50.166-48.839-50.166zm48.839-19.112h23.888v119.181c0 50.964-24.419 77.51-78.039 77.51-24.42 0-45.921-9.026-64.503-29.729l19.112-15.13c14.6 18.313 31.59 23.888 45.922 23.888 37.164 0 53.62-18.58 53.62-49.37v-9.821h-.531c-13.007 15.659-26.544 23.357-53.353 23.357-46.452 0-71.139-39.819-71.139-71.933 0-40.083 32.913-71.14 71.933-71.14 20.439 0 41.144 8.493 52.559 24.95h.53v-21.762" fill={theme.colors.brand.primary} />*/}
        {/*<path d="m619.533 128.722a5.417 5.417 0 0 1 4.71 2.737h4.422l6.868-16.68a2.7 2.7 0 0 1 5.156.376l7.3 32.236 7.442-43.476h.002a2.703 2.703 0 0 1 5.288-.19l8.047 32.668 4.067-12.162a2.705 2.705 0 0 1 4.817-.828l3.51 4.972c.11 1.175.18 2.362.18 3.567 0 1.593-.13 3.154-.322 4.697-.512-.192-.973-.478-1.284-.918l-.004.004-3.424-4.849-5.375 16.07a2.699 2.699 0 0 1 -3.418 1.703 2.696 2.696 0 0 1 -1.766-1.914h-.002l-7.171-29.123-7.55 44.103a2.703 2.703 0 0 1 -3.12 2.21 2.705 2.705 0 0 1 -2.217-2.23l-8.385-37.031-4.336 10.53a2.7 2.7 0 0 1 -2.497 1.675v.01h-6.26a5.419 5.419 0 1 1 -4.677-8.156" fill={theme.colors.variant.darker.default} />*/}
        {/*</svg>*/}
      </a>
    );
  } else {
    return (
      <a {...props} className="navbar-brand" style={{padding:'10px 15px'}}>
        <img width="125" height="32" src={CP_logo_lightground} />
      </a>
    )
  }

}

BrandComponent.propTypes = {
  active: PropTypes.bool,
  theme: themePropTypes.isRequired,
};

BrandComponent.defaultProps = {
  active: false,
};

export default withTheme(BrandComponent);
