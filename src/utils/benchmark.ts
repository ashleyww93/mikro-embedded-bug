import axios, { AxiosError } from 'axios';

const url = 'http://localhost:3123/graphql';
const duration = 5000; // Duration in milliseconds
const batchSize = 50; // Parallel requests

interface RequestStats {
    response: any;
    responseTime: number;
    statusCode: number | null;
    error: string | null;
}

async function sendRequest(): Promise<RequestStats> {
    const startTime = Date.now();
    try {
        const response = await axios.post(
            url,
            {
                query: `mutation RWTest { rwTestMikro }`,
            },
            {
                headers: {
                    'apollo-require-preflight': 'true',
                },
            },
        );

        const endTime = Date.now();
        const responseTime = endTime - startTime;
        return {
            response,
            responseTime,
            statusCode: response.status,
            error: null,
        };
    } catch (error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        if (error instanceof AxiosError) {
            return {
                response: undefined,
                responseTime,
                statusCode: error.response?.status || null,
                error: error.message,
            };
        }
        return {
            response: undefined,
            responseTime,
            statusCode: null,
            error: 'Unknown error',
        };
    }
}

async function benchmark() {
    const startTime = Date.now();
    const endTime = startTime + duration;
    let requestCount = 0;
    let totalResponseTime = 0;
    let minResponseTime = Infinity;
    let maxResponseTime = 0;
    const responseTimes: number[] = [];
    const errorCounts: { [key: string]: number } = {};

    while (Date.now() < endTime) {
        const requestPromises: Promise<RequestStats>[] = [];
        for (let i = 0; i < batchSize; i++) {
            requestPromises.push(sendRequest());
        }

        const results = await Promise.all(requestPromises);
        requestCount += results.length;

        for (const result of results) {
            totalResponseTime += result.responseTime;
            minResponseTime = Math.min(minResponseTime, result.responseTime);
            maxResponseTime = Math.max(maxResponseTime, result.responseTime);
            responseTimes.push(result.responseTime);

            if (result.error) {
                errorCounts[result.error] = (errorCounts[result.error] || 0) + 1;
            }
        }
    }

    const avgResponseTime = totalResponseTime / requestCount;
    const requestsPerSecond = requestCount / (duration / 1000);

    const jitter =
        responseTimes.reduce((sum, responseTime) => {
            const diff = Math.abs(responseTime - avgResponseTime);
            return sum + diff;
        }, 0) / requestCount;

    console.log(`Requests per second: ${requestsPerSecond.toFixed(2)}`);
    console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Minimum response time: ${minResponseTime}ms`);
    console.log(`Maximum response time: ${maxResponseTime}ms`);
    console.log(`Jitter: ${jitter.toFixed(2)}ms`);

    if (Object.keys(errorCounts).length > 0) {
        console.log('Errors:');
        for (const [error, count] of Object.entries(errorCounts)) {
            console.log(`- ${error}: ${count} occurrence(s)`);
        }
    }
}

benchmark();
