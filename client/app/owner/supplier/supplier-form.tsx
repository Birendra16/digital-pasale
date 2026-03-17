import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"
const SupplierSchema = Yup.object().shape({
    name:Yup.string().required("Name is required"),
    phone:Yup.string(),
    email:Yup.string().email("Invalid email"),
    address:Yup.string(),
    taxNumber: Yup.string(),
})

const SupplierForm = ({initialValues, onSubmit}:any) => {
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={SupplierSchema}
        onSubmit={onSubmit}
        >
            {({isSubmitting})=>(
                <Form className="space-y-4">
                    <div>
                        <Label>Supplier Name</Label>
                        <Field name="name" as={Input}/>
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                        <Field name="phone" as={Input}/>
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Field name="email" as={Input}/>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div>
                        <Label>Address</Label>
                        <Field name="address" as={Input} />
                    </div>

                    <div>
                        <Label>Tax Number</Label>
                        <Field name="taxNumber" as={Input} />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Supplier"}
                    </Button>
                </Form>
            )}
        </Formik>
  )
}

export default SupplierForm