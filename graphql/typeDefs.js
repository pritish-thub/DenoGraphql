const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload
  type User {
    id: String!
    firstName: String!
    lastName: String!
    emailId: String!
    mobileNumber: String!
    imageUrl: String
    token: String
  }
  type PropertyTransaction {
    name: String!
    price: String!
    country: String!
    status: String!
    imageUrl: String!
  }
  type SuccessResponse {
    status: Int!
    msg: String!
  }
  type OtpResponse {
    status: Int!
    otp: Int!
  }

  type BankDetailsReponse {
    id: Int
    userId: Int
    bankName: String
    accountNumber: String
    bankSwift: String
    branchCode: String
  }

  type BankDetailsList {
    id: Int!
    bankName: String!
  }

  type ProfileResponse {
    bankDetails: BankDetailsReponse
    user: User
  }

  type Investment {
    id: Int
    month: Int
    percentage: Int
  }

  type Query {
    login(emailId: String!, password: String!): User!
    getAllPropertyTransaction: [PropertyTransaction]!
    registerOtp(mobileNumber: String!): OtpResponse!
    loginOtp(email: String!): OtpResponse!
    getProfile: ProfileResponse!
    getAllBankNames: [BankDetailsList!]
    getInvestment: [Investment!]
  }

  type Mutation {
    register(
      firstName: String!
      lastName: String!
      emailId: String!
      mobileNumber: String!
      password: String!
    ): User!
    updatePassword(oldPassword: String!, newPassword: String!): SuccessResponse!
    addPropertyTransaction(
      name: String!
      price: String!
      country: String!
      status: String!
      file: Upload!
    ): PropertyTransaction!
    addBankDetails(
      bankName: String!
      accountNumber: String!
      bankSwift: String!
      branchCode: String!
    ): BankDetailsReponse!
    addInvestment(month: Int, percentage: Int): Investment!
    calculateInvestment(month: Int, percentage: Int): Int
  }
`;
