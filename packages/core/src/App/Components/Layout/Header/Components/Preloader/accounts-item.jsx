import ContentLoader from 'react-content-loader';
import React         from 'react';
import PropTypes     from 'prop-types';

const AccountsItemLoader = ({ speed }) => (
    <ContentLoader
        height={24}
        width={246}
        speed={speed}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <circle cx='12' cy='13' r='10' />
        <rect x='30' y='3' rx='0' ry='0' width='108' height='20' />
        <rect x='175' y='3' rx='0' ry='0' width='70' height='20' />
    </ContentLoader>
);

AccountsItemLoader.propTypes = {
    speed: PropTypes.number,
};

export { AccountsItemLoader };
