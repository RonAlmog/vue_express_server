const Transaction = require('../../models/transaction')

module.exports = function (router) {

    router.get('/transaction/:year/:month', function (req, res) {
        const userId = req.get('userId');
        const month = req.params.month - 1;
        const year = req.params.year;
        const startDt = new Date(Date.UTC(year, month, 1, 0, 0, 0))
        const endDt = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0))

        const qry = {
            userId: userId,
            transactionDate: {
                $gte: startDt,
                $lt: endDt
            }
        }

        Transaction.find(qry)
            .sort({ 'transactionDate': 1 })
            .exec()
            .then(docs => res.status(200).json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding transaction for user',
                    error: err
                })
            )

    })


    router.get('/transaction/balance/:year/:month', function (req, res) {
        const userId = req.get('userId');
        const month = req.params.month - 1;
        const year = req.params.year;
        const endDt = new Date(Date.UTC(year, month, 1))
        const pipeline = [
            {
                $match: {
                    userId: userId,
                    transactionDate: { $lt: endDt }
                }
            },
            {
                $group: {
                    _id: null,
                    charges: {$sum: '$charge'},
                    deposits: {$sum: '$deposit'}
                }
            }
        ]

        Transaction.aggregate(pipeline).exec()
            .then(docs=> res.status(200).json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error ',
                    error: err
                })
            )
    });

    router.post('/transaction', function(req, res) {
        let transaction = new Transaction(req.body);
        transaction.save(function(err, trans) {
            if(err) return console.log(err)
            res.status(200).json(trans)
        })
    });

}