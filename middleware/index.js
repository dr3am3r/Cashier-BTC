export function getPaymentInfo(req, res, next) {
    let exchangeRate, btcToAsk, satoshiToAsk

    const { satoshiToAsk, btcToAsk } = getCurrencyRate(req.params.currency)

    let privateKey = new bitcore.PrivateKey()
    let address = new bitcore.Address(privateKey.toPublicKey())

    let addressData = {
      'timestamp': Math.floor(Date.now() / 1000),
      'expect': req.params.expect,
      'currency': req.params.currency,
      'exchange_rate': exchangeRate,
      'btc_to_ask': btcToAsk,
      'message': req.params.message,
      'seller': req.params.seller,
      'customer': req.params.customer,
      'callback_url': decodeURIComponent(req.params.callback_url),
      'WIF' : privateKey.toWIF(),
      'address' : address.toString(),
      'private_key' : privateKey.toString(),
      'public_key' : privateKey.toPublicKey().toString(),
      'doctype' : 'address',
      '_id' : address.toString()
    }

    let paymentInfo = {
      address: addressData.address,
      message: req.params.message,
      label: req.params.message,
      amount: satoshiToAsk
    }

    let answer = {
      'link': new bitcore.URI(paymentInfo).toString(),
      'qr': config.base_url_qr + '/generate_qr/' + encodeURIComponent(new bitcore.URI(paymentInfo).toString()),
      'qr_simple': config.base_url_qr + '/generate_qr/' + addressData.address,
      'address': addressData.address
    };

    req.payment = {
      // donuya vsego
    }

    next()
}

function getCurrencyRate(currency = '') {
  let exchangeRate = 1

    switch (currency) {
      case 'USD': exchangeRate = btcUsd
        break
      case 'EUR': exchangeRate = btcEur
        break
      case 'BTC':
      default:
        break
    }

    satoshiToAsk = Math.floor((req.params.expect / exchangeRate) * 100000000)
    btcToAsk = satoshiToAsk / 100000000
    return { satoshiToAsk, btcToAsk }
}
