document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault(); 
    
        document.getElementById('tableBody1').innerHTML = '';
        document.getElementById('tableBody2').innerHTML = '';
        document.getElementById('results1').style.display = 'none';
        document.getElementById('results2').style.display = 'none';
    
        let method = document.getElementById('method').value;
        let x0 = parseFloat(document.getElementById('x0').value);
        let y0 = parseFloat(document.getElementById('y0').value);
        let xn = parseFloat(document.getElementById('xn').value);
        let h = parseFloat(document.getElementById('step').value);
        let inputfn = document.getElementById('equation').value; 
    
        if (method == 'euler') 
        {
            document.getElementById('tableTitle1').style.display = 'block';
            document.getElementById('results1').style.display = 'block';
            document.getElementById('tableTitle2').style.display = 'none';
        } 
        else if (method === 'heun') 
        {
            document.getElementById('tableTitle2').style.display = 'block';
            document.getElementById('results2').style.display = 'block';
            document.getElementById('tableTitle1').style.display = 'none';
        }
    
        let f = new Function('x', 'y', 'return ' + inputfn);
        let x_val1 = [], y_val1 = [], x_val2 = [], y_val2 = [], itr_val1 = [], itr_val2 = [];
        let x_1 = x0, y_1 = y0, x_2 = x0, y_2 = y0;
    
        // for Euler
        x_val1.push(x_1);
        y_val1.push(y_1);
        itr_val1.push(0);

        let n1 = Math.floor((xn - x0) / h);
            for (let i = 0; i < n1; i++) 
            {
                y_1 += h * f(x_1, y_1);
                x_1 += h;
                x_val1.push(x_1);
                y_val1.push(y_1);
            }
    
            let tableBody1 = document.getElementById('tableBody1');
            for (let i = 0; i < x_val1.length; i++) 
            {
                let row = document.createElement('tr');
                row.innerHTML = `<td>${i}</td><td>${x_val1[i].toFixed(5)}</td><td>${y_val1[i].toFixed(5)}</td>`;
                tableBody1.appendChild(row);
            }
    
        // for Heun   
        x_val2.push(x_2);
        y_val2.push(y_2);
        itr_val2.push(0);

        let n2 = Math.floor((xn - x0) / h);
            for (let i = 0; i < n2; i++) 
            {
                let initial = f(x_2, y_2);
                let y_pred = y_2 + h * initial;
                let x_next = x_2 + h;
                let y_corr = y_pred;
                let itr = 0;
                let diff;
    
                do 
                {
                    let next = f(x_next, y_corr);
                    let y_new = y_2 + (h / 2) * (initial + next);
                    diff = Math.abs(y_new - y_corr);
                    y_corr = y_new;
                    itr++;
                } 
                while (diff > 10 ** -6);
    
                itr_val2.push(itr);
                x_2 = x_next;
                y_2 = y_corr;
                x_val2.push(x_2);
                y_val2.push(y_2);
            }
    
            let tableBody2 = document.getElementById('tableBody2');
            for (let i = 0; i < x_val2.length; i++) 
            {
                let row = document.createElement('tr');
                row.innerHTML = `<td>${i}</td><td>${x_val2[i].toFixed(5)}</td><td>${y_val2[i].toFixed(5)}</td><td>${itr_val2[i] || 0}</td>`;
                tableBody2.appendChild(row);
            }
    
        plotGraph(x_val1, y_val1, x_val2, y_val2);

        
        if (method === 'euler') {
            let value = y_val1[y_val1.length - 1].toFixed(5);
            let message = `∴ y(${xn}) ≈ ${value}`;
            let concludeDiv = document.createElement('div');
            concludeDiv.innerHTML = message;
    
            let concludeContainer = document.getElementById('conclusion');
            concludeContainer.innerHTML = '';
            concludeContainer.appendChild(concludeDiv);
        }
        else if (method === 'heun') {
            let value = y_val2[y_val2.length - 1].toFixed(5);
            let message = `∴ y(${xn}) ≈ ${value}`;
            let concludeDiv = document.createElement('div');
            concludeDiv.innerHTML = message;
    
            let concludeContainer = document.getElementById('conclusion');
            concludeContainer.innerHTML = '';
            concludeContainer.appendChild(concludeDiv);
        }
    
    
        function plotGraph(xval1, yval1, xval2, yval2) 
        {
            var trace1 = {
                    x: xval1,
                    y: yval1,
                    mode: 'lines',
                    name: 'Euler approximation',
                };

            var trace2 = {
                    x: xval2,
                    y: yval2,
                    mode: 'lines',
                    name: 'Heun approximation',
            };
    
            var data = [trace1, trace2];
            var layout = {
                    title: 'Graph',
                    xaxis: {
                        title: 'x',
                    },
                    yaxis: {
                        title: 'y',
                    }
                };
    
            Plotly.newPlot('graph', data, layout);
        }
    
        });
    });
    