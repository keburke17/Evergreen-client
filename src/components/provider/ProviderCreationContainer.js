import React, { useEffect } from 'react';
import ProviderForm from 'components/provider/ProviderForm';
import { Table, Button, Form } from 'antd';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';
import { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import { isNil } from 'lodash';

configure({
    axios: axiosInstance,
})

const offerColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Offer Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Offer Description',
        dataIndex: 'description',
        key: 'description',
    }
];

const pathwayColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Pathways Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Pathways Description',
        dataIndex: 'description',
        key: 'description',
    }
];

const ProviderCreationContainer = (({ className, closeModal }, ref) => {
    const [ form ] = Form.useForm();
    const store = useProviderDataFieldStore();
    const { datafield: datafieldStore, provider: providerStore } = store;
    const { typeEqualsProvider, typeEqualsTopic } = datafieldStore;

    const typeEntities = Object.values(datafieldStore.entities);
    const types = typeEntities.filter(typeEqualsProvider);
    const topics = typeEntities.filter(typeEqualsTopic);
    
    const submit = async () => {
        const values = form.getFieldsValue([
            "name",
            "location",
            "type",
            "learn_and_earn",
            "is_public",
            "industry",
            "description",
            "industry",
            "financial_aid",
            "credit",
            "news",
            "contact",
            "pay",
            "cost",
            "topics"
        ]);

        const { name, location, type, learn_and_earn, is_public } = values;

        if (
            name && location && type && learn_and_earn && !isNil(is_public)
        ) {
            try {
                const response = await axiosInstance.post('/providers', {
                    ...values,
                    topics: JSON.stringify(values.topics),
                });

                if (response.status === 201) {
                    providerStore.addOne(response.data);
                    closeModal();
                }
            } catch(e) {
                console.error(e);
            }
        }
    }

    useEffect(() => {
        
    }, [providerStore]);

    return (
        <div>
            <Form
                form={form}
                name="providerForm"
            >
                <div className="p-6">
                    <ProviderForm
                        types={types}
                        topics={topics}
                    />
                    <section className="mt-2">
                        <label className="mb-2 block">
                            Offers - Table
                        </label>
                        <Table
                            columns={offerColumns}
                            dataSource={[]}
                        />
                    </section>
                    <section className="mt-2">
                        <label className="mb-2 block">
                            Pathways -Table
                        </label>
                        <Table
                            columns={pathwayColumns}
                            dataSource={[]}
                        />
                    </section>
                </div>
                <section
                    className="bg-white px-6 pt-6 pb-1 flex justify-center"
                    style={{
                        borderTop: "1px solid #f0f0f0"
                    }}
                >
                    <Button
                        className="mr-3 px-20"
                        type="primary"
                        htmlType="submit"
                        onClick={submit}
                    >
                        Create
                    </Button>
                    <Button
                        className="px-20"
                        type="dashed"
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </Button>
                </section>
            </Form>
        </div>
    );
})

export default ProviderCreationContainer;
