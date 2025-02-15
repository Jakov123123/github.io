$(function() {
    $('#date-range').daterangepicker({
        opens: 'left',
        drops: 'up',
        autoApply: true,
        minDate: moment(),
        locale: {
            format: 'DD/MM/YYYY'
        }
    });
});