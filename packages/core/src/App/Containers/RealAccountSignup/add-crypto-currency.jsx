import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormSubmitButton, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile, reorderCurrencies, website_name } from '@deriv/shared';
import { CurrencyRadioButtonGroup, CurrencyRadioButton } from '@deriv/account';
import './currency-selector.scss';

const messages = () => [
    <Localize key={0} i18n_default_text='Choose your preferred cryptocurrency' />,
    <Localize key={1} i18n_default_text='You can open an account for each cryptocurrency.' />,
    <Localize key={2} i18n_default_text='Add a real account' />,
    <Localize key={3} i18n_default_text='Choose a currency you would like to trade with.' />,
];

const Headers = ({ heading, subheading }) => (
    <React.Fragment>
        <Text as='h1' color='prominent' align='center' weight='bold' className='add-crypto-currency__title'>
            {heading}
        </Text>
        <Text as='h3' size='xxs' color='prominent' align='center' className='add-crypto-currency__sub-title'>
            {subheading}
        </Text>
    </React.Fragment>
);

const FIAT_CURRENCY_TYPE = 'fiat';
const CRYPTO_CURRENCY_TYPE = 'crypto';

const AddCryptoCurrency = ({
    available_crypto_currencies,
    form_error,
    has_fiat,
    legal_allowed_currencies,
    onSubmit,
    should_show_crypto_only,
    should_show_fiat_only,
    value,
    hasNoAvailableCrypto,
}) => {
    const getReorderedFiatCurrencies = () =>
        reorderCurrencies(legal_allowed_currencies.filter(currency => currency.type === FIAT_CURRENCY_TYPE));
    const getReorderedCryptoCurrencies = () =>
        reorderCurrencies(
            legal_allowed_currencies.filter(currency => currency.type === CRYPTO_CURRENCY_TYPE),
            CRYPTO_CURRENCY_TYPE
        );

    const canAddFiat = () => !has_fiat && !should_show_crypto_only;
    const canAddCrypto = currency => {
        // check if the cryptocurrency has not been created
        return available_crypto_currencies.map(e => e.value).indexOf(currency.value) === -1;
    };

    return (
        <Formik
            initialValues={{
                currency: value.currency,
            }}
            onSubmit={(values, actions) => {
                onSubmit(false, values, actions.setSubmitting);
            }}
        >
            {({ handleSubmit, values, errors, touched, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    {!canAddFiat() && <Headers heading={messages()[0]} subheading={messages()[1]} />}
                    {canAddFiat() && <Headers heading={messages()[2]} subheading={messages()[3]} />}
                    {canAddFiat() && (
                        <React.Fragment>
                            <CurrencyRadioButtonGroup
                                id='fiat_currency'
                                is_fiat
                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                value={values.currency}
                                error={errors.currency}
                                touched={touched.currency}
                                is_title_enabled={canAddFiat()}
                                item_count={getReorderedFiatCurrencies().length}
                            >
                                {getReorderedFiatCurrencies().map(currency => (
                                    <Field
                                        key={currency.value}
                                        component={CurrencyRadioButton}
                                        name='currency'
                                        id={currency.value}
                                        label={currency.name}
                                    />
                                ))}
                            </CurrencyRadioButtonGroup>
                        </React.Fragment>
                    )}
                    {canAddFiat() && (
                        <Text as='p' color='prominent' size='xxs' className='currency-selector__deposit-warn'>
                            <Localize i18n_default_text='You’ll not be able to change currency once you have made a deposit.' />
                        </Text>
                    )}
                    {hasNoAvailableCrypto() && (
                        <div className='account-wizard--disabled-message'>
                            <Text
                                as='p'
                                align='center'
                                size='xxs'
                                className='account-wizard--disabled-message-description'
                            >
                                {localize(
                                    'You already have an account for each of the cryptocurrencies available on {{deriv}}.',
                                    {
                                        deriv: website_name,
                                    }
                                )}
                            </Text>
                        </div>
                    )}
                    {!should_show_fiat_only &&
                        (available_crypto_currencies.length !== 0 ? (
                            <CurrencyRadioButtonGroup
                                id='crypto_currency'
                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                label={
                                    <Text as='h2' align='center' size='s' weight='bold' color='prominent'>
                                        {localize('Cryptocurrencies')}
                                    </Text>
                                }
                                value={values.currency}
                                error={errors.currency}
                                touched={touched.currency}
                                is_title_enabled={canAddFiat()}
                                item_count={getReorderedCryptoCurrencies().length}
                            >
                                {getReorderedCryptoCurrencies().map(currency => (
                                    <Field
                                        key={currency.value}
                                        component={CurrencyRadioButton}
                                        name='currency'
                                        id={currency.value}
                                        label={currency.name}
                                        selected={canAddCrypto(currency)}
                                    />
                                ))}
                            </CurrencyRadioButtonGroup>
                        ) : (
                            <CurrencyRadioButtonGroup
                                id='crypto_currency'
                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                label={localize('Cryptocurrencies')}
                                is_title_enabled={canAddFiat()}
                                item_count={getReorderedCryptoCurrencies().length}
                            >
                                {getReorderedCryptoCurrencies().map(currency => (
                                    <Field
                                        key={currency.value}
                                        component={CurrencyRadioButton}
                                        name='currency'
                                        id={currency.value}
                                        label={currency.name}
                                        selected
                                    />
                                ))}
                            </CurrencyRadioButtonGroup>
                        ))}
                    <FormSubmitButton
                        className='currency-selector__button'
                        is_disabled={isSubmitting || !values.currency}
                        label={localize('Add account')}
                        is_absolute={!isMobile()}
                        form_error={form_error}
                    />
                </form>
            )}
        </Formik>
    );
};

AddCryptoCurrency.propTypes = {
    available_crypto_currencies: PropTypes.array,
    legal_allowed_currencies: PropTypes.array,
    has_fiat: PropTypes.bool,
    hasNoAvailableCrypto: PropTypes.func,
    form_error: PropTypes.string,
    onSubmit: PropTypes.func,
    should_show_crypto_only: PropTypes.bool,
    should_show_fiat_only: PropTypes.bool,
    value: PropTypes.shape({
        crypto: PropTypes.string,
        fiat: PropTypes.string,
    }),
};

export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    legal_allowed_currencies: client.upgradeable_currencies,
    has_fiat: client.has_fiat,
}))(AddCryptoCurrency);
