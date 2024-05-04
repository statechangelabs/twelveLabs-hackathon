import { FC, Fragment } from "react";
import { Formik, Form, Field } from "formik";

const Home: FC = () => {
  return (
    <Fragment>
      <div
        className="h-screen w-screen fixed z-0"
        style={{ backgroundImage: "url('/bg.webp')" }}
      ></div>
      <div className="z-10">
        <div>
          <div className="p-10 m-10 rounded-md bg-gray-200 text-xl">Home</div>
        </div>
        <div>
          <Formik
            initialValues={{ search: "" }}
            onSubmit={(values) => console.log(values)}
          >
            {({ handleChange, handleSubmit, values, dirty, isSubmitting }) => (
              <Form>
                <Field name="search" type="text" />
                <button type="submit">Search</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};
export default Home;
