import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import Loading from "./loading";
import Router from "next/router";

import { redirect, useRouter } from "next/navigation";

const onFinish = async (values: any) => {
  console.log("values:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [msgSuccess, setMsgSuccess] = useState<String>("");

  const router = useRouter();

  const [form] = Form.useForm();

  const userName = Form.useWatch("username", form);
  const passWord = Form.useWatch("password", form);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.API_DEV}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: passWord,
        }),
      });
      const data = await response.json();
      console.log("Success:", data);

      if (data.success == true) {
        setIsSuccess(data.success);
        setMsgSuccess(
          "Đăng kí thành công,bạn đã có tàì khoản vui lòng đăng nhập!"
        );
        localStorage.setItem("accessToken", data.accessToken);
        router.push(`/register/${userName}`);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the request completes
    }
  }

  return (
    <div className="flex  flex-col items-center justify-between bg-white p-10 bg-opacity-80 rounded-lg">
      <h3 className="mb-5">REGISTER</h3>
      <Form
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        onSubmitCapture={onSubmit}
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <p className={isSuccess ? "text-green-500 mb-5" : "text-rose-600 mb-5"}>
          {isSuccess ? msgSuccess : "Username is duplicated"}
        </p>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            loading={isLoading}
            className="bg-black/80"
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
